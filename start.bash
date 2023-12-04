folder=$1

mkdir $folder
cd $folder

echo "{
  \"devDependencies\": {
    \"@types/node\": \"^20.10.1\"
  },
  \"name\": \"${folder}\",
  \"version\": \"1.0.0\",
  \"main\": \"main.ts\",
  \"dependencies\": {
    \"undici-types\": \"^5.26.5\"
  },
  \"scripts\": {
    \"start\": \"tsc && node ./main.js\",
    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"
  },
  \"author\": \"\",
  \"license\": \"ISC\",
  \"description\": \"\"
}" >> package.json

echo '{
  "compilerOptions": {
    "target": "es2015",
    "module": "commonjs",
    "sourceMap": true
  }
}' >> tsconfig.json

echo '' >> main.ts