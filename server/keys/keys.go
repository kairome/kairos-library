package keys

import (
	"crypto/rsa"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"io/ioutil"
	"os"
)

var SigningKey *rsa.PrivateKey
var VerifyingKey *rsa.PublicKey

func Init() {
	privateKeyPath := os.Getenv("RSA_PRIVATE")
	publicKeyPath := os.Getenv("RSA_PUBLIC")

	var msg string
	var err error

	privateKey, err := ioutil.ReadFile(privateKeyPath)
	if err != nil {
		msg = fmt.Sprintf("Error reading private key.\n%v\n", err.Error())
		panic(msg)
	}

	publicKey, err := ioutil.ReadFile(publicKeyPath)
	if err != nil {
		msg = fmt.Sprintf("Error reading public key.\n%v\n", err.Error())
		panic(msg)
	}

	SigningKey, err = jwt.ParseRSAPrivateKeyFromPEM(privateKey)
	if err != nil {
		msg = fmt.Sprintf("Error parsing private key.\n%v\n", err.Error())
		panic(msg)

	}

	VerifyingKey, err = jwt.ParseRSAPublicKeyFromPEM(publicKey)
	if err != nil {
		msg = fmt.Sprintf("Error parsing public key.\n%v\n", err.Error())
		panic(msg)

	}
}
