from pathlib import Path
from setuptools import setup, find_packages

BASE_DIR = Path(__file__).parent


def read_version() -> str:
    context: dict[str, str] = {}
    exec((BASE_DIR / "pos_customization" / "__init__.py").read_text(), context)
    return context["__version__"]


def read_requirements() -> list[str]:
    requirements_file = BASE_DIR / "requirements.txt"
    if not requirements_file.exists():
        return []
    return [line.strip() for line in requirements_file.read_text().splitlines() if line.strip()]


setup(
    name="pos_customization",
    version=read_version(),
    description="Usability improvements for ERPNext Point of Sale",
    author="POS Customization Maintainers",
    author_email="support@example.com",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=read_requirements(),
    license="MIT",
    classifiers=[
        "Development Status :: 4 - Beta",
        "License :: OSI Approved :: MIT License",
        "Framework :: Frappe",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
    ],
)
