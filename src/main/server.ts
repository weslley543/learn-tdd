import { MongoHelper } from '../infra/mongodb/helpers/mongo-helper'
import env from './config/env'

MongoHelper.connect(env.mongoUrl).then( async () => {
   const app = (await import ('./config/app')).default
   app.listen(env.port, () => {
       console.log(`Server running at port ${env.port}`)
   })
})
