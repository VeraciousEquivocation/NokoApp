const axios = require('axios');
// const path = require('path');
const express = require('express');
const app = express();
// const builder = require('xmlbuilder');

app.use(express.json());
////////////// FOR PROD ENVIRONMENT ////////////////////////
// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
////////////// FOR PROD ENVIRONMENT ////////////////////////


/*///////////////////////////////////////////////////////////

	Get the projects list from Noko	

*////////////////////////////////////////////////////////////
app.use('/api/*',(req, res, next) => {
    req.context = {
        userAgent: '[YOUR APP NAME FOR NOKO]',
        baseURL: 'https://api.nokotime.com/v2',
    };
    next();
  });
  

app.post('/api/getList', (req,res, next) => {

    let axiosSetup = {
       'method' : 'get',
       'contentType': 'application/json',
	   'url': req.context.baseURL + '/projects/'
    };
    axiosSetup.headers = {
		'User-Agent': req.context.userAgent,
		'X-NokoToken':req.body.token
	}
	axios(axiosSetup)
	.then( result => {
		var listResultParsed = result.data;
		
		var projArr = [];
		var tempObj = {};
		listResultParsed.forEach(function(obj){
		  tempObj.id = obj.id;
		  tempObj.name = obj.name;
		  projArr.push({...tempObj});
		});

		return res.send(projArr);

	})
	.catch( err => {
        console.log('\n\n\n GET PROJECT LIST ERROR ###############\n\n\n',err.response.data);
        next(err);
        return;
	});

});

/*///////////////////////////////////////////////////////////

	Get Current User Entries from Noko	

*////////////////////////////////////////////////////////////
app.post('/api/fetchEntries', function (req, res, next) {
    let postUrl = req.context.baseURL+'/current_user/entries';
    let payload = JSON.parse(req.body.payload);
    
    let config = {
        headers: {
            'User-Agent': req.context.userAgent,
            'X-NokoToken':req.body.token
        }
    }
    
    config.params = payload;

    axios.get(postUrl,config)
        .then( result => {
	    	var listResultParsed = result.data;
        
	    	var entryArr = [];
	    	var tempObj = {};
            listResultParsed.forEach(function(obj){
	    	  tempObj.id = obj.id;
	    	  tempObj.date = obj.date;
	    	  tempObj.minutes = obj.minutes;
	    	  tempObj.tags = obj.tags.map((t)=>t.formatted_name);
	    	  tempObj.projectId = obj.project.id;
	    	  tempObj.projectName = obj.project.name;
	    	  tempObj.projectColor = obj.project.color;
	    	  entryArr.push({...tempObj});
            });

			console.log('\n\n\n\n\n\n              ENTRY LIST SUCCESS                     \n\n\n\n\n\n');
			
	    	return res.send(entryArr);

	    })
	    .catch( err => {
            console.log('\n\n\n ENTRY LIST FETCH ERROR ###############\n\n\n',err.response.data);
            next(err);
            // return res.send(err);
            return;
	    });
});

/*///////////////////////////////////////////////////////////

	Update a single, or multiple, Entrie(s) in Noko

*////////////////////////////////////////////////////////////

app.post('/api/post', function (req, res, next) {
    let postUrl = req.context.baseURL+'/entries';
    let dateArray = req.body.dateArray ? [...req.body.dateArray] : [];
    let payload = req.body.payload;
    
    let config = {
        headers: {
            'User-Agent': req.context.userAgent,
            'X-NokoToken':req.body.token
        },
    }

    if(dateArray.length > 0) {
        let postArray = [];
        for (let i = dateArray.length - 1; i >= 0; i--) {
			let request = JSON.parse(req.body.payload);
			request.date = dateArray[i];
			let stringified = JSON.stringify(request);
            postArray.push(
				new Promise(function(resInner,rejInner){
					setTimeout(function () {
						let prom = axios.post(postUrl,stringified,config);
						prom.then(
							function(data){
							// The above promise is done and getting to this first function means it was
							// resolved and not rejected.
							// Resolve the outer promise here.
							console.log('\n\n\n\n\n\n               INNER SUCCESS                     \n\n\n\n\n\n');
							resInner(data);
						},
						function(err){ 
							console.log('\n\n\n\n\n\n               ERR INNER ERR                     \n\n\n\n\n\n');
							console.log('\n\n\n ERROR INNER SPECIFICS ###############\n\n',err.response.data);
							resInner(err); 
						}
						);
					}, 500 * i)
				})
			);
		}

        axios.all(postArray)
          .then((responses) => {
			let statusArray = [];
			responses.forEach(response => {
				statusArray.push(response.status);
			});
			console.log('#######\n\n### END OF all axios calls ###\n\n#########');
			res.send(statusArray);
			return;
          })
          .catch(err => {
            console.log('\n\n\n\n\n\n                   OUTER ERROR                     \n\n\n\n\n\n');
			console.log(err);
			next(err);
            return;
        });
    } else {
        axios.post(postUrl,payload,config)
        .then( result => {
            return res.send('success');
        })
        .catch(err => {
            console.log('\n\n\n\n\n\n                   ERROR SINGLE ENTRY                     \n\n\n\n\n\n');
			console.log(err);
			console.log('\n\n\n ENTRY ERROR SINGLE ENTRY SPECIFICS ###############\n\n',err.response.data);
            next(err.response);
            return;
        });
    }
    
});

/*///////////////////////////////////////////////////////////

	Delete a single, or multiple, Entrie(s) in Noko

*////////////////////////////////////////////////////////////

app.post('/api/delete', function (req, res, next) {
	let request = JSON.parse(req.body.payload);
	let postUrl = req.context.baseURL+'/entries/'+request.id;
	console.log('\n\n\nWE"VE HIT THE DELETE METHOD\n\n\n');
	// Can add multiple deletion, would be similar loop to creating entries
	// let idArray = req.body.idArray ? [...req.body.idArray] : [];
	
	let config = {
		headers: {
			'User-Agent': req.context.userAgent,
			'X-NokoToken':req.body.token
		},
	}
	axios.delete(postUrl,config)
	.then( result => {
		console.log('DELETED!');
		return res.send('success');
	})
	.catch(err => {
		console.log('\n\n\n\n\n\n                   ERROR DELETE                     \n\n\n\n\n\n');
		console.log(err);
		console.log('\n\n\n ERROR DELETE SPECIFICS ###############\n\n',err.response.data);
		next(err.response);
		return;
	});
});

/////////// FOR DEV ENVIRONMENT //////////////////////////////////
app.listen(3010, () => console.log(`Listening on port 3010`));
/////////// FOR DEV ENVIRONMENT //////////////////////////////////

/////////// FOR PROD ENVIRONMENT //////////////////////////////////
// app.listen(process.env.PORT || 8080, () => console.log(`Listening on port 8080`));
