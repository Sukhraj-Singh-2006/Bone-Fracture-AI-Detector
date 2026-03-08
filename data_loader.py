from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

from pathlib import Path
from torchvision import datasets, transforms
from torch.utils.data import DataLoader


def _to_rgb(img):
    return img.convert("RGB")


def _resolve_data_dir(path):
    path_obj = Path(path)
    if path_obj.exists():
        return str(path_obj)

    module_relative = Path(__file__).resolve().parent / path_obj
    if module_relative.exists():
        return str(module_relative)

    raise FileNotFoundError(f"Dataset directory not found: {path}")


def get_data_loaders(train_dir, val_dir, test_dir, batch_size=32):

    train_dir = _resolve_data_dir(train_dir)
    val_dir = _resolve_data_dir(val_dir)
    test_dir = _resolve_data_dir(test_dir)

    train_transform = transforms.Compose([
        transforms.Lambda(_to_rgb),
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
        transforms.Normalize([0.5,0.5,0.5],[0.5,0.5,0.5])
    ])

    val_transform = transforms.Compose([
        transforms.Lambda(_to_rgb),
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize([0.5,0.5,0.5],[0.5,0.5,0.5])
    ])

    train_dataset = datasets.ImageFolder(train_dir, transform=train_transform)
    val_dataset = datasets.ImageFolder(val_dir, transform=val_transform)
    test_dataset = datasets.ImageFolder(test_dir, transform=val_transform)

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=4,
        pin_memory=True
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=4,
        pin_memory=True
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=4,
        pin_memory=True
    )

    return train_loader, val_loader, test_loader, len(train_dataset.classes)