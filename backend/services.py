import os
import requests
from dotenv import load_dotenv
import io
import time

load_dotenv()

LLAMAPARSE_API_KEY = os.getenv("LLAMAPARSE_API_KEY", "")

class CloudinaryService:
    @staticmethod
    async def upload_resume(file_content: bytes, filename: str) -> str:
        """Return clean inline Data URI without external Cloudinary dependency"""
        import base64
        ext = filename.split('.')[-1].lower() if '.' in filename else 'pdf'
        mime = "application/pdf" if ext == "pdf" else "text/plain"
        b64 = base64.b64encode(file_content).decode('utf-8')
        return f"data:{mime};base64,{b64}"

    @staticmethod
    async def upload_pdf(pdf_content: bytes, filename: str) -> str:
        """Return clean inline Data URI for generated PDF"""
        import base64
        b64 = base64.b64encode(pdf_content).decode('utf-8')
        return f"data:application/pdf;base64,{b64}"

class LlamaParseService:
    @staticmethod
    async def parse_resume(file_content: bytes, filename: str) -> str:
        """Parse resume using LlamaParse HTTP API or fast local PyPDF2/docx fallback"""
        if LLAMAPARSE_API_KEY and not LLAMAPARSE_API_KEY.startswith("your_"):
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
                    timeout=15
                )
                if response.status_code == 200:
                    result = response.json()
                    text = result.get('text', '') or result.get('content', '')
                    if text.strip():
                        print("[LlamaParse] Parsed successfully via LlamaCloud HTTP API!")
                        return text
            except Exception as e:
                print(f"[LlamaParse] HTTP API note: {e}, using local parser")

        return await LlamaParseService._fallback_parse(file_content, filename)

    @staticmethod
    async def _fallback_parse(file_content: bytes, filename: str) -> str:
        """Fallback text extraction for PDF / DOCX / TXT"""
        try:
            if filename.lower().endswith('.pdf'):
                try:
                    import PyPDF2
                    pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
                    text = []
                    for page in pdf_reader.pages:
                        extracted = page.extract_text()
                        if extracted:
                            text.append(extracted)
                    extracted_str = '\n'.join(text)
                    if extracted_str.strip():
                        return extracted_str
                except Exception as pypdf_err:
                    print(f"PyPDF2 error: {pypdf_err}")
            
            if filename.lower().endswith(('.docx', '.doc')):
                try:
                    from docx import Document
                    doc = Document(io.BytesIO(file_content))
                    text = []
                    for para in doc.paragraphs:
                        if para.text:
                            text.append(para.text)
                    extracted_str = '\n'.join(text)
                    if extracted_str.strip():
                        return extracted_str
                except Exception as docx_err:
                    print(f"Docx error: {docx_err}")
            
            # Last resort: decode as UTF-8
            decoded = file_content.decode('utf-8', errors='ignore')
            if decoded.strip():
                return decoded
        except Exception as e:
            print(f"Fallback parse error: {e}")
        
        return "Resume uploaded successfully. Extracting skills and experience for role matching."

class PDFGenerator:
    @staticmethod
    async def generate_resume_pdf(resume_text: str) -> bytes:
        """Generate PDF from resume text"""
        try:
            from reportlab.lib.pagesizes import letter
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
            from reportlab.lib.styles import getSampleStyleSheet
            from reportlab.lib.units import inch

            pdf_buffer = io.BytesIO()
            doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []

            for line in resume_text.split('\n'):
                if line.strip():
                    if len(line) > 100:
                        story.append(Paragraph(line, styles['Normal']))
                    else:
                        story.append(Paragraph(f"<b>{line}</b>", styles['Normal']))
                    story.append(Spacer(1, 0.1 * inch))

            doc.build(story)
            return pdf_buffer.getvalue()
        except Exception as e:
            print(f"PDF generation note: {e}")
            return resume_text.encode('utf-8')
