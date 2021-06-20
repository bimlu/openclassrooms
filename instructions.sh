### Perform each command in new terminal

### Make sure rabbitmq is running
# sudo systemctl start rabbitmq-server.service

### Make sure postgres database 'kousa_repo2' is running
# sudo -i -u postgres
# psql postgres
# CREATE DATABASE kousa_repo2;

### Elixir API
cd kousa && source env.txt
# mix deps.get
# mix ecto.migrate
iex -S mix

### Voice Server
cd shawarma
# yarn
yarn watch

### API Client
# Make sure 'kebab' is build
# cd kebab
# yarn build

### Next.js frontend
cd kibbeh && yarn dev