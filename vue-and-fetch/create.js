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
		newId: 0,
		parentUrl: '',
	},
	methods:{
		Save:function(s) {
			let theResult = "Started creating...";
			console.log("create function called... TITLE: (" + this.record.title 
			+ "), author: (" + this.record.author + ")");

			// POST it.
			fetch("http://localhost:3000/posts", {
				method: 'post',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					'title': app.record.title, 
					'author': app.record.title,
				})
			})
			// .then(json)
			.then(function(data) {
				// app.resultText = "The request succeeded";
				data.json().then(function(json){
					app.resultText = "Created record #" + json.id;
					window.location.href = app.parentUrl;
				});
			})
			.catch(function (error) {
				app.resultText = "Request failed.";
				console.error('request failed', error);
			});

		},
		Cancel() {

			window.location.href = this.parentUrl;
		},
		checkForm(e) {
			console.log("form checked!");
			e.preventDefault();
			this.Save();
			return false;
		}
	},
	created() {
		let str = window.location.href;
		this.parentUrl = str.substring(0, str.lastIndexOf("/"));
	}
});
