# Escaneo 3D Backend (Python)

Backend en FastAPI para subir fotos y ejecutar un pipeline basico con COLMAP.

## Requisitos
- Python 3.10+
- COLMAP instalado y disponible en PATH

## Instalacion
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Ejecutar
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints
- `GET /health`
- `POST /scans` (multipart/form-data con multiples imagenes)
- `POST /scans/{scan_id}/process`

## Notas
- El pipeline usa una configuracion conservadora para mantener la malla ligera.
- Si COLMAP no esta en PATH, el endpoint de proceso retornara error.
