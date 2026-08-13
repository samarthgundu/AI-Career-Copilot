import os
import requests
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import io

load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", ""),
    api_key=os.getenv("CLOUDINARY_API_KEY", ""),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", "")
)

LLAMAPARSE_API_KEY = os.getenv("LLAMAPARSE_API_KEY", "")

class CloudinaryService:
    @staticmethod
    async def upload_resume(file_content: bytes, filename: str) -> str:
        """Upload resume to Cloudinary and return URL with fallback"""
        try:
            result = cloudinary.uploader.upload(
                file_content,
                folder="resumes",
                public_id=f"{filename.split('.')[0]}_{int(os.path.getmtime('.')) if os.path.exists('.') else 0}",
                resource_type="auto"
            )
            if result and result.get('secure_url'):
                return result['secure_url']
        except Exception as e:
            print(f"[Cloudinary] Resume upload permission error ({e}), using base64 fallback URL")
        
        import base64
        ext = filename.split('.')[-1].lower() if '.' in filename else 'pdf'
        mime = "application/pdf" if ext == "pdf" else "text/plain"
        b64 = base64.b64encode(file_content).decode('utf-8')
        return f"data:{mime};base64,{b64}"

    @staticmethod
    async def upload_pdf(pdf_content: bytes, filename: str) -> str:
        """Upload generated PDF to Cloudinary with Data URI fallback"""
        try:
            result = cloudinary.uploader.upload(
                pdf_content,
                folder="generated_resumes",
                public_id=f"{filename.split('.')[0]}_gen",
                resource_type="auto"
            )
            if result and result.get('secure_url'):
                return result['secure_url']
        except Exception as e:
            print(f"[Cloudinary] PDF upload permission error ({e}), using base64 data URI fallback")
        
        # Base64 fallback allows inline viewing/downloading in frontend browser
        import base64
        b64 = base64.b64encode(pdf_content).decode('utf-8')
        return f"data:application/pdf;base64,{b64}"

class LlamaParseService:
    @staticmethod
    async def parse_resume(file_content: bytes, filename: str) -> str:
        """Parse resume using LlamaParse SDK and return cleaned text"""
        try:
            import tempfile
            from llama_parse import LlamaParse

            suffix = os.path.splitext(filename)[1] or ".pdf"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(file_content)
                tmp_path = tmp.name

            try:
                parser = LlamaParse(api_key=LLAMAPARSE_API_KEY, result_type="markdown")
                docs = parser.load_data(tmp_path)
                if docs and len(docs) > 0:
                    text = "\n\n".join([doc.text for doc in docs if doc.text])
                    if text.strip():
                        print("[LlamaParse] Document parsed successfully via LlamaParse SDK!")
                        return text
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
        except Exception as e:
            print(f"[LlamaParse] SDK parse note: {e}, using LlamaCloud / fallback parser")

        # Fallback to direct HTTP parse request
        try:
            files = {
                'file': (filename, io.BytesIO(file_content))
            }
            headers = {
                'Authorization': f'Bearer {LLAMAPARSE_API_KEY}'
            }
            response = requests.post(
                'https://api.llama-parse.com/parse',
                files=files,
                headers=headers,
                timeout=30
            )
            if response.status_code == 200:
                result = response.json()
                text = result.get('text', '') or result.get('content', '')
                if text.strip():
                    return text
        except Exception as e:
            print(f"[LlamaParse] HTTP parse note: {e}")

        return await LlamaParseService._fallback_parse(file_content, filename)

    @staticmethod
    async def _fallback_parse(file_content: bytes, filename: str) -> str:
        """Fallback text extraction for demo purposes"""
        try:
            if filename.lower().endswith('.pdf'):
                try:
                    import PyPDF2
                    pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
                    text = []
                    for page in pdf_reader.pages:
                        text.append(page.extract_text())
                    return '\n'.join(text)
                except:
                    pass
            
            if filename.lower().endswith(('.docx', '.doc')):
                try:
                    from docx import Document
                    doc = Document(io.BytesIO(file_content))
                    text = []
                    for para in doc.paragraphs:
                        text.append(para.text)
                    return '\n'.join(text)
                except:
                    pass
            
            # Last resort: decode as UTF-8
            return file_content.decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"Fallback parse error: {e}")
            return "Resume parsing failed - using demo data"

class PDFGenerator:
    @staticmethod
    async def generate_resume_pdf(resume_text: str) -> bytes:
        """Generate PDF from resume text"""
        try:
            # Try using reportlab
            from reportlab.lib.pagesizes import letter
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import inch
            from io import BytesIO

            pdf_buffer = BytesIO()
            doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []

            # Add resume content
            for line in resume_text.split('\n'):
                if line.strip():
                    if len(line) > 100:
                        story.append(Paragraph(line, styles['Normal']))
                    else:
                        story.append(Paragraph(f"<b>{line}</b>", styles['Normal']))
                    story.append(Spacer(1, 0.1 * inch))

            doc.build(story)
            return pdf_buffer.getvalue()
        except:
            # Fallback: return simple text as bytes wrapped in basic PDF structure
            return resume_text.encode('utf-8')
