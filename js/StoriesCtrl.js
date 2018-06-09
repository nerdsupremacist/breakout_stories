
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
            var withMedia = postings.filter((x) => x.media !== null && x.user.profilePic !== null);
            var byTeams = withMedia.bulked((x) => x.user.participant.teamId );
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

            var object = stories.map((x) => {
                return {
    id: x.user.participant.teamId,
    photo: x.user.profilePic.url,
    name: x.user.participant.teamName,
    lastUpdated: x.lastUpdated,
    items: x.posts.map((post) => {
        return {
            id: post.id,
            type: post.media.type == "IMAGE" ? "photo" : "video",
            src: post.media.url
        }
    })
}
            });

            stories = new Zuck('stories', {
    id: '',
    skin: 'snapgram',
    avatars: true,
    list: false,
    openEffect: true,
    cubeEffect: false,
    autoFullScreen: false,
    backButton: true,
    backNative: false,
    previousTap: true,
    stories: object});

            callback(stories);
        });
    }

    loadStories((stories) => {
        $scope.stories = stories;
    });

});
