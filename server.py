#!/usr/bin/env python3
import subprocess
import sys
import os

# Ejecutar Vite dev server en lugar del servidor Python
os.execvp("npm", ["npm", "run", "dev"])
