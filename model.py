import timm
import torch.nn as nn


def create_model(num_classes):

    model = timm.create_model(
        "vit_small_patch16_224",
        pretrained=True
    )

    # replace classifier head
    model.head = nn.Linear(model.head.in_features, num_classes)

    return model