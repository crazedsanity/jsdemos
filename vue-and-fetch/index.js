Vue.filter('formatDate', function(d) {
	if(!window.Intl) return d;
	return new Intl.DateTimeFormat('en-US').format(new Date(d));
}); 

const app = new Vue({
	el:'#app',
	data:{
		term:'',
		results:[],
		noResults:false,
		searching:true,
		fetchInfo:'Searching...',
	},
	methods:{
		search:function() {
			// this.searching = true;
			fetch(`http://localhost:3000/posts?q=${encodeURIComponent(this.term)}`)
			.then(res => {
				if(res.ok) {
					return res.json();
				}
				else {
					console.warn("There was an error::: ");
					console.log(res);
					throw res;
				}
			})
			.then(res => {
				this.searching = false;
				this.results = res;
				this.noResults = res.length === 0;
			})
			.catch(error => {
				console.log(error);
				app.fetchInfo = "ERROR: " + error.status + ": " + error.statusText;
			});
		},
		CreateNew() {
			window.location.href += "create.html";
		},
	},
	created() {
		this.search();
	}
});