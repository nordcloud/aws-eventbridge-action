const core = require('@actions/core');
const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");


const main = async () => {
  try {
    const client = new EventBridgeClient({region: core.getInput('region')});
    const params = {
      Entries: [
        {
          Detail: core.getInput('detail') || undefined,
          DetailType: core.getInput('detail_type') || undefined,
          EventBusName: core.getInput('event_bus_name') || undefined,
          Resources: [core.getInput('resources')] || undefined,
          Source: core.getInput('source') || undefined,
          Time: core.getInput('timestamp') || new Date().toISOString(),
          TraceHeader: core.getInput('trace_header') || undefined,
        }
      ]
    }

    const response = await client.send(new PutEventsCommand(params));
    core.setOutput('http_status_code', response.$metadata.httpStatusCode);
    core.setOutput('attempts', response.$metadata.attempts);
    core.setOutput('request_id', response.$metadata.requestId);
    core.setOutput('response', response);
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();
