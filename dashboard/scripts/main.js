/* eslint-env browser */

"use strict";

import jsonrender from 'https://www.w3.org/PM/Groups/jsonrender.js';

const config = {
  ttl: 15,
};

// parse the URL to update the config
for (const [key, value] of (new URL(window.location)).searchParams) {
  config[key] = value;
}

function dateFormat(time) {
  return moment(time).fromNow()
}

function dateColor(arg_time) {
  const time = new Date(Date.parse(arg_time)),
      now = new Date();

  if (((now-time)/1000)/(60*60*24) > 14) {
     return "color--red"
  } else {
    return "color--green"
  }
};
const functions =
{
  prettyComments: (comments) => {
    if (comments > 0) {
      return { className: 'color--green', text: comments + " comment" + ((comments>1)?"s":"") }
    } else {
      return { className: 'color--red', text: "no comment" }
    }
  },
  prettyDate: (time) => {
    return { className: dateColor(time), text: dateFormat(time) }
  },
};

function sortIssues(a, b) {
  if (a.number > b.number)
    return 1;
  if (a.number < b.number)
    return -1;
  return 0;
}

function sortRepositories(a, b) {
  if (a.name > b.name)
    return 1;
  if (a.name < b.name)
    return -1;
  return 0;
}
const CACHE = "https://labs.w3.org/github-cache";

// telemetry for performance monitoring
const traceId = (""+Math.random()).substring(2, 18); // for resource correlation
const rtObserver = new PerformanceObserver(list => {
  const resources = list.getEntries().filter(entry => entry.name.startsWith(CACHE + '/v3/repos/w3c'));
  if (resources.length > 0) {
    navigator.sendBeacon(`${CACHE}/monitor/beacon`, JSON.stringify({ traceId, resources }));
  }
});
rtObserver.observe({entryTypes: ["resource"]});

(function () {
  fetch("repositories.json").then(res => res.json()).then(async (repositories) => {
    for (const repo of repositories) {
      repo.issues = fetch(`${CACHE}/v3/repos/${repo.repo}/issues?ttl=${config.ttl}`)
          .then(res => res.json())
          .then(issues => {
            return issues.sort(sortIssues);
        }).catch(err => err);
    }
    return repositories.sort(sortRepositories);
  }).then(repositories => {
    const elts = document.querySelectorAll("*.group-repositories");
    for (const element of elts) jsonrender({ repositories  }, element, functions);
  });
})();
