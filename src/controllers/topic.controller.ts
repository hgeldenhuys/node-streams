import {Request, RestBindings, get, param} from '@loopback/rest';
import {inject} from '@loopback/context';
// import {CreateTopicResponse} from 'kafka-node';

const
  kafka = require('kafka-node');
  // Producer = kafka.Producer;

/**
 * OpenAPI response for ping()
 */
// const PING_RESPONSE: ResponseObject = {
//   description: 'Ping Response',
//   content: {
//     'application/json': {
//       schema: {
//         type: 'object',
//         title: 'PingResponse',
//         properties: {
//           greeting: {type: 'string'},
//           date: {type: 'string'},
//           url: {type: 'string'},
//           headers: {
//             type: 'object',
//             properties: {
//               'Content-Type': {type: 'string'},
//             },
//             additionalProperties: true,
//           },
//         },
//       },
//     },
//   },
// };

/**
 * A simple controller to bounce back http requests
 */
export class TopicController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @get('/topics', {
    responses: {
      '200': {},
    },
  })
  topics(
    @param.query.boolean("include_system_topics", {required: false}) includeSystemTopics = false
  ): object {
    const
      client = new kafka.KafkaClient({
        clientId: "teamworks-api",
        kafkaHost: "broker:9092"
      }),
      admin = new kafka.Admin(client);
      // producer = new Producer(client),
      // topicsToCreate = [{
      //   topic: 'topic1',
      //   partitions: 1,
      //   replicationFactor: 1
      // }];
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return new Promise<{}>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      admin.listTopics((err, res: [{}, {metadata: {[key: string]: object}}]) => {
        if (err) {
          resolve(err);
        } else if (res) {
          if (!includeSystemTopics) Object.keys(res[1].metadata).forEach((key, indx) => {
            // console.log(key);
            if (key.startsWith("_")) {
              delete res[1].metadata[key];
            }
          });
          resolve(res[1].metadata);
        } else return {};
        client.close();
      });
    });

    // // client.createTopics()
    // client.createTopics(topicsToCreate, (error: object, result: CreateTopicResponse[]) => {
    //   if (result) console.log(result);
    //   if (error) console.error(error);
    //   producer.send([{
    //     topic: 'topic1',
    //     messages: ['message body'], // multi messages should be a array, single message can be just a string or a KeyedMessage instance
    //     key: 'theKey', // string or buffer, only needed when using keyed partitioner
    //     partition: 0, // default 0
    //     attributes: 2, // default: 0
    //     timestamp: Date.now() // <-- defaults to Date.now() (only available with kafka v0.10+)
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //     // @ts-ignore
    //   }], (error2, result2) => {
    //     if (result2) console.log(result2);
    //     if (error2) console.error(error2);
    //     const admin = new kafka.Admin(client);
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //     // @ts-ignore
    //     admin.listTopics((err, res) => {
    //       console.log('topics', JSON.stringify(res, undefined, 2));
    //       client.close();
    //     });
    //   })
    // });
    // return {
    //   greeting: 'Hello from LoopBack',
    //   date: new Date(),
    //   url: this.req.url,
    //   headers: Object.assign({}, this.req.headers),
    // };
  }
}
