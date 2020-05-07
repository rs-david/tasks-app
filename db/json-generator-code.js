/* https://www.json-generator.com/ */
[
    '{{repeat(1000)}}',
    {
        name: '{{firstName()}}',
        created: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-dd hh:mm:ss")}}',
        description: function (tags) {
            var fruits = ['apple', 'banana', 'strawberry', 'melon', 'grapes', 'watermelon', 'orange'];
            return fruits[tags.integer(0, fruits.length - 1)];
        }
    }
]
