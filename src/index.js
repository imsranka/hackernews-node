const { ApolloServer } = require("apollo-server");
const fs = require('fs');
const path = require('path');

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for graphql'
},
{
    id: 'link-1',
    url: 'www.prisma.com',
    description: 'Fullstack tutorial for prisma'
}];

let idCount = links.length;
console.log(idCount)
// this is actual implementation of graphql schema
const resolvers = {
    Query: {
        info: () => `This is the api for hackernews clone`,
        feed: () => links,
        link: (parent, args) => {
            const foundLink = links.find(link=>link.id === args.id)
            if(!foundLink){
                return {
                    id: 'NA',
                    url: 'NA',
                    description: 'NA'
                }
            }
            return foundLink;
        }
    },
    // Link: {
    //     id: (parent) => {console.log(parent); return parent.id},
    //     description: (parent) => parent.description,
    //     url: (parent) => parent.url,
    // },
    Mutation: {
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            }
            links.push(link)
            return link
        },
        updateLink: (parent, args) => {
            const { url, description, id } = args;
            const updateLink = links.find(link=>link.id === id)
            if(!updateLink){
                return {
                    id: 'NA',
                    url: 'NA',
                    description: 'NA'
                }
            }
            updateLink.url = url;
            updateLink.description = description;
            
            return updateLink;
        },
        deleteLink: (parent, args) => {
            const delLink = links.find(link=>link.id === args.id)
            
            const index = links.findIndex(link=>link.id === args.id)
            console.log(delLink, index)
            if(!index){
                return 'no element'
            }
            links.splice(index,1)
            return delLink;
        }
    }
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
         'utf8'
    ),
    resolvers,
})

server
    .listen()
    .then(({url}) => 
        console.log(`Sever is running on ${url}`)
    )