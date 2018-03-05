server/index.js: 

  set interval, line 30: 
    - makes another api call to update the retweets and favorites on all the tweets that are stored in DB

  set interval, line 34: 
    - makes a call to twitter for trumps tweets
    - checks if any of them are not already in our DB, if not, add them to DB

  set interval, line 123: 
	- every minute, it checks if now === billing cycle date (stored in DB global variable collection)
	- if true, then it counts all the tweets in the DB from the last week
	- the new billing cycle date is updated to a week from now, the updateSubs function is called to update all the subscription quantities from that week



  update subs function, line 49:
    - takes in the weekly tweet count from the set interval from line 123
    - iterates (using recursion b/c of async) over all users in the DB and updates the subscription 
    quantities either to the new count or the user's max weekly limit. 
    - meanwhile, each user's total donated gets updated.
    - meanwhile, the total donated count gets updated as well (this is stored in the global variables 
     collection).

   line 266, post /updateCustomer: 
     - if a customer wants to change their credit card info, this function deletes the current cc and then changes the card info on their customer object. We store the customer id in the user collection, and the logged in customer profile (all columns from the db collection) is stored on the front end

   line 299, post /customerToken: 
     - this takes in the stripe token from the front end (but only a few pieces from it, since we didn't want to send the CC number through the browser)
     - using stripe functions, this creates a new customer in stripe, then creates a subscription for that customer. The quantity of plans is initially set to 0, since this is updated weekly before billing
     - the billing cycle anchor specifies the first time they will get billed (they won't get charged during the first partial week they join). The date is set to 5 minutes after the next billing cycle date
     - 

   SESSIONS:
     - we store the express-sessions in MongoStore (see line 26)
     - we're really close to having persistent sessions, the only thing lacking is grabbing the cookie from the browser on componentDidMount. Then, check to see if that session is still active in the DB, if so, login the user to keep them logged in


    


