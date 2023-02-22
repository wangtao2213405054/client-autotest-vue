rm -rf ./static
rm -rf ./index.html
unzip -o ./dist.zip
rm -rf ./dist.zip
mv ./dist/index.html ./index.html
mv ./dist/favicon.ico ./favicon.ico
mv ./dist/static ./static
rm -rf ./dist
