import { SandboxedJob } from "bullmq"
import { gql, GraphQLClient } from "graphql-request"
import sharp from "sharp"
import { DOSpaces } from "../../modules/DOSpaces"
import { APP_ENDPOINT } from "../../modules/Env"
import { SECRET_KEY } from "../../modules/Key"



const t = new DOSpaces()


const client = new GraphQLClient(APP_ENDPOINT, {
    headers: {
        authorization: SECRET_KEY
    }
})

module.exports = async (job: SandboxedJob) => {

}