# Understanding Fetch Metadata (FM) Breakages

In order to make Fetch Metadata breakages easy to diagnose, we recommend including metadata on why the response was rejected in the 403 response page (either in the body or in the response headers). This makes it so that checking if a breakage is caused by Fetch Metadata is as simple as checking whether there are any 403 responses rejected by your policy. 

Additionally, it is recommended to exempt 404 pages from your Fetch Metadata policies. Suppose that a page includes `<img src=other.com/photos/myurl>` and that `other.com/photos/myurl` is exempted from RIP since it is meant to be referenced cross-site. If the photo is not found, the site responds with a 404 error. If RIP is enforced for the 404 page, the 404 error will be converted to a potentially confusing 403 error. 

Since Fetch Metadata policies are enforced server-side, it is very easy to add centralized logging and monitoring of how Fetch Metadata policies are affecting your application. For example, an application could trigger an alert if more than 1% of requests to a given URL are getting blocked by Fetch Metadata policies. This is useful for both detecting breakages and understanding the impact of any breakages.
