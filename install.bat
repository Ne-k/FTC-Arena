@echo off

start cmd /k "cd api && npm i"

ping 127.0.0.1 -n 2 > nul

start cmd /k "cd website && npm i"