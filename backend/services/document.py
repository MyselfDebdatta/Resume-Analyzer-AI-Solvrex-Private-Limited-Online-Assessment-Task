import pdfplumber
import io
import docx

def extract_text_from_document(file_bytes: bytes, filename: str) -> str:
    """Extracts text from PDF, DOCX, or TXT files."""
    ext = filename.lower().split('.')[-1]
    text = ""
    
    try:
        if ext == "pdf":
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        elif ext in ["docx", "doc"]:
            # Note: python-docx handles .docx files. For older .doc files it might fail, 
            # but we catch exceptions in the router anyway.
            doc = docx.Document(io.BytesIO(file_bytes))
            for para in doc.paragraphs:
                text += para.text + "\n"
        elif ext == "txt":
            text = file_bytes.decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error extracting text from {filename}: {str(e)}")
        
    return text.strip()
