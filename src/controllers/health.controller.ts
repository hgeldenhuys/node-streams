import {inject} from '@loopback/context';
import {get, Request, Response, RestBindings} from '@loopback/rest';

const ping = require("ping");

export class HealthController {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
    @inject(RestBindings.Http.RESPONSE)
    private readonly response: Response,
  ) {
  }

  @get('ping', {responses: {}})
  ping() {
    return new Promise((resolve, reject) => {
      const
        hosts = ['zookeeper', 'broker', 'schema-registry', 'connect', 'ksqldb-server', 'control-center', 'rest-proxy'],
        // responseData: {host: string, alive: boolean}[] = [],
        promises: Promise<{host: string, resolvedHost: string, alive: string, time: number}>[] = hosts.map(function(host) {
          return ping.promise.probe(host);
        });
      Promise.all(promises)
        .then((promisesResolved) => {
          resolve(promisesResolved.map((result, idx) => {
            return {
              resolvedHost: result.host,
              host: hosts[idx],
              alive: result.alive,
              time: result.time
            };
          }));
        })
        .catch(reason => reject(reason));
    });
  }
}
