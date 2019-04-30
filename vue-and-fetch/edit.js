Vue.filter('formatDate', function(d) {
	if(!window.Intl) return d;
	return new Intl.DateTimeFormat('en-US').format(new Date(d));
}); 


const app = new Vue({
	el:'#app',
	data:{
		record: {
			'title': '',
			'author': ''
		},
		url: 'http://localhost:3000',
		resultText: 'Nothing yet...',
		id: 0,
		parentUrl: '',
	},
	methods:{
		Save:function(s) {
			console.log(app.record);
			// Save it (via PUT)
			fetch("http://localhost:3000/posts/" + app.id, {
				method: 'put',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					'title': app.record.title,
					'author': app.record.author,
					'savedby': "vue",
					'savedate': Date.now().toString()
				})
			})
			.then(function(data) {
				console.log("save succeeded");
				data.json().then(function(json) {
					console.log("data returned: ");
					console.log(json);
				});
				window.location.href = app.parentUrl;
			})
			.catch(function(error) {
				console.error(error);
			});

		},
		retrieve() {
			fetch("http://localhost:3000/posts/"+ this.id)
			.then(function(data) {
				if(data.ok) {
					console.log("got results");
					app.resultText = "Data received";
					data.json().then(function(json) {
						app.resultText = "Retrieved record #"+ json.id;
						app.record = json;
	
						document.title = "Editing #" + json.id + ": "+ json.title;
					});
				}
				else {
					// pause page loading (thre's probably a better way)
					if(alert("You selected an invalid record")) {
						console.log("finished");
					}
					window.location.href = app.parentUrl;
				}
			})
			.catch(function(error) {
				console.error(error);
			});
		},
		Cancel() {
			window.location.href = this.parentUrl;
		},
		Delete() {
			if(confirm("Are you sure you want to delete this record?")) {
				console.log("confirmed");
				fetch("http://localhost:3000/posts/"+ this.id, {
					method: 'delete',
					headers: {
						'Accept': 'application/json, text/plain, */*',
						'Content-Type': 'application/json'
					}
				})
				.then(function(data) {
					console.log("it worked: ");
					console.log(data);
					window.location.href = app.parentUrl;
				})
				.catch(function(error) {
					console.error(error);
				});
			}
			else {
				console.log("canceled");
			}
		},
		checkForm(e) {
			console.log("form checked!");
			e.preventDefault();
			this.Save();
			return false;
		}
	},
	created() {
		console.log(window.location.href);
		let theUrl = new URL(window.location.href);
		console.log("parameters: ");
		console.log(theUrl.searchParams.get("id"));
		this.id = theUrl.searchParams.get("id");
		
		let str = window.location.href;
		this.parentUrl = str.substring(0, str.lastIndexOf("/"));

		this.retrieve();
	}
});
