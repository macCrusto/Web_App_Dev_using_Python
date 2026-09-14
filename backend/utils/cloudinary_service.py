import os
from pathlib import Path
from typing import Any

import cloudinary
import cloudinary.uploader
from werkzeug.datastructures import FileStorage

from config import Config


if Config.CLOUDINARY_URL:
    cloudinary.config(cloudinary_url=Config.CLOUDINARY_URL, secure=True)
else:
    cloudinary.config(
        cloud_name=Config.CLOUDINARY_CLOUD_NAME,
        api_key=Config.CLOUDINARY_API_KEY,
        api_secret=Config.CLOUDINARY_API_SECRET,
        secure=True,
    )


def resource_type_for(file: FileStorage) -> str:
    content_type = (file.mimetype or "").lower()
    if content_type.startswith("image/"):
        return "image"
    if content_type.startswith("video/"):
        return "video"
    return "raw"


def upload_file(file: FileStorage, folder: str) -> dict[str, Any]:
    result = cloudinary.uploader.upload(
        file,
        folder=folder,
        resource_type=resource_type_for(file),
        use_filename=True,
        unique_filename=True,
        overwrite=False,
    )
    return result


def file_extension(filename: str | None) -> str:
    return Path(filename or "").suffix.lower().lstrip(".")


def file_size_kb(file: FileStorage) -> int:
    current_position = file.stream.tell()
    file.stream.seek(0, os.SEEK_END)
    size = file.stream.tell()
    file.stream.seek(current_position)
    return max(1, (size + 1023) // 1024)
