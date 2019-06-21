


$.get('res/story.txt', function(data) {
    $('.aventure').append(document.createTextNode(data));
}, 'text');