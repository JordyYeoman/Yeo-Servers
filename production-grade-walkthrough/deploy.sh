echo "Pulling latest main...."
git pull

echo "Building..."
docker-compose up -d --build