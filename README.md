1. npm init ---> npm
2. npm i express, cors, body-parser, jwt-token, prisma
3. intialize prisma DB for our https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-prismaPostgres
    3.1 npx prisma
    3.2 npx prisma init --db --output ../generated/prisma 
    3.3 write complete model
    3.4 npx prisma migrate


Assignment : 
get /habit/:userId {filter, sorting}
post /habit/:userId
patch /habit/:id
put /habit/:id
