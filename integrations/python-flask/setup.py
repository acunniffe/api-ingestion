"""Setup script for optic-document-flask"""

import os.path
from setuptools import setup

# The directory containing this file
HERE = os.path.abspath(os.path.dirname(__file__))

# The text of the README file
with open(os.path.join(HERE, "README.md")) as fid:
    README = fid.read()

# This call to setup() does all the work
setup(
    name="optic-document-flask",
    version="0.1.3",
    description="Document a flask API with Optic",
    long_description=README,
    long_description_content_type="text/markdown",
    url="https://github.com/opticdev/api-ingestion",
    author="Optic",
    author_email="acunniffe@gmail.com",
    license="MIT",
    classifiers=[

    ],
    packages=["optic"],
    include_package_data=True,
    install_requires=[
        "flask"
    ],
    entry_points={},
)
