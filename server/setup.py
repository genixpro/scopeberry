import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))

with open("requirements.txt", 'rt') as f:
    requirements = [r.strip() for r in f.readlines() if r.strip()]

setup(
    name='planguru',
    version='0.0.1',
    description='Plan Guru',
    long_description=open("README.md", "rt").read(),
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Flask',
    ],
    author='Bradley Arsenault',
    author_email='genixpro@gmail.com',
    url='planguru.io',
    keywords='artificial intelligence llm',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    extras_require={
    },
    package_data={
        'planguru': [
            'config/prebuilt_configs/*.json'
        ]
    },
    python_requires='>=3.6',
    install_requires=requirements,
    entry_points={
        'console_scripts': [
            'planguru_server = planguru.bin.server:main'
        ]
    }
)