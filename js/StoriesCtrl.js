
Array.prototype.dictionary = function (map) {
    return this.reduce((acc, item) => {
        var key = map(item);
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
    }, {});
};

Array.prototype.bulked = function (map) {
    var object = this.dictionary(map);
    return Object.keys(object).map((x) => object[x]);
};

app.controller('StoriesCtrl', function($scope, $routeParams, $http) {

    $scope.stories = [];

    function loadPostings(callback) {
        $http.get("https://backend.break-out.org/posting/").then(function(res) {
            callback(res.data);
        }, function(err) {
            console.error(err);
            callback(null);
        });
    }

    function loadStories(callback) {
        loadPostings((postings) => {
            if (postings !== null) callback(null);
            var withMedia = postings.filter((x) => x.media);
            var byTeams = postings.bulked((x) => x.user.participant.teamId);
            var stories = byTeams.map((x) => {
                var user = x[0].user;
                var posts = x;
                var lastUpdated = new Date(x[0].date);
                return {
                    user: user,
                    posts: posts,
                    lastUpdated: lastUpdated
                }
            });
            callback(stories);
        });
    }

    loadStories((stories) => {
        $scope.stories = stories;
    });

});
