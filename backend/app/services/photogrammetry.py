import os
import shutil
import subprocess
from pathlib import Path


def _run(cmd: list[str], cwd: Path | None = None) -> None:
    subprocess.run(cmd, cwd=str(cwd) if cwd else None, check=True)


def run_pipeline(input_dir: Path, output_dir: Path) -> dict:
    """
    Runs a minimal COLMAP pipeline if COLMAP is available in PATH.
    Returns a dict with status and key output paths.

    This is intentionally conservative to keep meshes light.
    """
    colmap = shutil.which("colmap")
    if not colmap:
        return {
            "status": "error",
            "message": "COLMAP not found in PATH. Install COLMAP and retry.",
        }

    database_path = output_dir / "database.db"
    sparse_dir = output_dir / "sparse"
    dense_dir = output_dir / "dense"
    undistorted_dir = dense_dir / "undistorted"

    sparse_dir.mkdir(parents=True, exist_ok=True)
    dense_dir.mkdir(parents=True, exist_ok=True)

    # 1) Feature extraction
    _run([
        colmap, "feature_extractor",
        "--database_path", str(database_path),
        "--image_path", str(input_dir),
    ])

    # 2) Feature matching
    _run([
        colmap, "exhaustive_matcher",
        "--database_path", str(database_path),
    ])

    # 3) Sparse reconstruction
    _run([
        colmap, "mapper",
        "--database_path", str(database_path),
        "--image_path", str(input_dir),
        "--output_path", str(sparse_dir),
    ])

    # Use the first sparse model
    model_dir = next(sparse_dir.iterdir(), None)
    if not model_dir:
        return {"status": "error", "message": "Sparse model not generated"}

    # 4) Undistort images
    _run([
        colmap, "image_undistorter",
        "--image_path", str(input_dir),
        "--input_path", str(model_dir),
        "--output_path", str(undistorted_dir),
        "--output_type", "COLMAP",
    ])

    # 5) Dense reconstruction (optional but useful for mesh)
    _run([
        colmap, "patch_match_stereo",
        "--workspace_path", str(undistorted_dir),
        "--workspace_format", "COLMAP",
        "--PatchMatchStereo.max_image_size", "1600",
    ])

    # 6) Fuse into point cloud
    fused_ply = dense_dir / "fused.ply"
    _run([
        colmap, "stereo_fusion",
        "--workspace_path", str(undistorted_dir),
        "--workspace_format", "COLMAP",
        "--input_type", "geometric",
        "--output_path", str(fused_ply),
    ])

    return {
        "status": "ok",
        "sparse": str(model_dir),
        "fused": str(fused_ply),
    }
