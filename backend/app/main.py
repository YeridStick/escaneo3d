import os
import uuid
from pathlib import Path
from typing import List

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.services.photogrammetry import run_pipeline

BASE_DIR = Path(__file__).resolve().parent
STORAGE_DIR = BASE_DIR / "storage"
WORK_DIR = BASE_DIR / "workdir"

STORAGE_DIR.mkdir(parents=True, exist_ok=True)
WORK_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Escaneo 3D API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/scans")
async def create_scan(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    scan_id = uuid.uuid4().hex
    scan_dir = STORAGE_DIR / scan_id
    scan_dir.mkdir(parents=True, exist_ok=True)

    saved = []
    for upload in files:
        if not upload.filename:
            continue
        target = scan_dir / upload.filename
        contents = await upload.read()
        target.write_bytes(contents)
        saved.append(target.name)

    if not saved:
        raise HTTPException(status_code=400, detail="No valid files to save")

    return {"scan_id": scan_id, "files": saved}


@app.post("/scans/{scan_id}/process")
def process_scan(scan_id: str):
    scan_dir = STORAGE_DIR / scan_id
    if not scan_dir.exists():
        raise HTTPException(status_code=404, detail="Scan not found")

    output_dir = WORK_DIR / scan_id
    output_dir.mkdir(parents=True, exist_ok=True)

    result = run_pipeline(input_dir=scan_dir, output_dir=output_dir)
    return {"scan_id": scan_id, "result": result}
