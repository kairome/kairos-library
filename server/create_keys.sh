#!/bin/bash
ssh-keygen -t rsa -b 4096 -f ../jwt_rsa.key
openssl rsa -in ../jwt_rsa.key -pubout -outform PEM -out ../jwt_rsa.key.pub
