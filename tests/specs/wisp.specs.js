var postJsonData = {};
$.ajax({
    dataType: 'json',
    url: 'stubs/posts/100/index.php',
    async: false,
    success: function (r) {
        postJsonData = r;
    }
});

describe('WisP', function () {

    WisP.config.baseUrl = "stubs";

    describe('Post Model', function () {
        beforeEach(function () {
            this.post = new WisP.Post();
        });
        it('Post default should be set', function () {
            expect(this.post.get("id")).toBe(0);
        });
        it('Post should set given id', function () {
            post = new WisP.Post({id: 1});
            expect(post.get("id")).toBe(1);
        });
        it('Url method should use baseUrl', function () {
            expect(this.post.url()).toBe('stubs/posts/0');
        });
        it('Fetch should set remote data', function () {
            var result;
            post = new WisP.Post({id: 100});
            getPost();

            waitsFor(function () {
                return result === true;
            }, "get remote model data", 3000);

            runs(function () {
                expect(post.get('title')).toBe('Lorem Ipsum Dolor!');
            });

            function getPost() {
                post.fetch({
                    success: function () {
                        result = true;
                    },
                    error: function () {
                        result = false;
                    }
                });
            }

        });
    });

    describe('Post View', function () {
        beforeEach(function () {
            this.postView = new WisP.PostView();
        });
        it('This template should be a function', function () {
            expect(typeof(this.postView.template)).toBe('function');
        });
        it('Render should create html with model data', function () {
            postView = new WisP.PostView({model: new WisP.Post});
            html = postView.render();
            expect($(html).find('h3').text()).toBe('Default Post Title');
        });
    });

    describe('Posts Collection', function () {
        beforeEach(function () {
            this.posts = new WisP.Posts([], {paged: 4});
        });

        it('The posts collection should set the page attribute', function () {
            expect(this.posts.paged).toBe(4);
        });
        it('The collection per page should match config', function () {
            expect(this.posts.per_page).toBe(WisP.config.per_page);
        });
        it('Adding model should add to collection', function () {
            this.posts.add([new WisP.Post]);
            expect(this.posts.models.length).toBe(1);
        });
        it('The url should use variables', function () {
            posts = new WisP.Posts([], {paged: 100});
            expect(posts.url).toBe('stubs/posts/?per_page=3&paged=100');
        });
        it('Should add option category', function () {
            posts = new WisP.Posts([], {category: 5});
            expect(posts.url).toBe('stubs/posts/?per_page=3&paged=1&cat=5');
        });
        it('Should add models from remote', function () {
            var result;
            posts = new WisP.Posts();
            getPosts();

            waitsFor(function () {
                return result === true;
            }, 'gets posts', 3000);

            runs(function () {
                expect(posts.models.length).toBe(3);
            });

            function getPosts() {
                posts.fetch({
                    success: function () {
                        result = true;
                    },
                    error: function () {
                        result = false;
                    }
                });

            }

        });
    });

    describe('Post Archive View', function () {
        beforeEach(function () {
            this.posts = new WisP.Posts();
            this.postsView = new WisP.PostArchiveView({collection: this.posts});
        });
        it('Adding a model should render html', function () {
            html = this.postsView.renderOne(new WisP.Post());
            expect($(html).find('h4 a').text()).toBe('Default Post Title');
        });
        it('Should render from remote', function () {
            var result;
            posts = new WisP.Posts({paged: 2});
            postsView = new WisP.PostArchiveView({collection: posts});
            length = $(postsView.el).find('h3').length;
            getPosts();
            waitsFor(function () {
                return result === true;
            }, "get posts", 3000);

            runs(function () {
                //expect($(postsView.el).find('h3').length).toBe(3);
            });

            function getPosts() {
                posts.fetch({
                    success: function () {
                        result = true;
                    },
                    error: function () {
                        result = false;
                    }
                })
            }

        });
    });

    describe('Controller', function () {
        beforeEach(function () {

        });
        it('showPosts should create collection', function () {
            WisP.Controller.showPosts();
            expect(typeof WisP.currentPosts).toBe('object');
        });

        it('showPosts should create collection with category', function () {
            WisP.Controller.showPosts('100');
            url = WisP.currentPosts.url;
            expect(url.substr(url.indexOf('cat'), 7)).toBe('cat=100');
        });

        it('showPost should get post from ID', function () {
            WisP.Controller.showPost(100);
            expect(WisP.currentPost.get('id')).toBe(100);
        });

        it('showPost should set empty if ID not set', function () {
            WisP.Controller.showPost();
            expect(WisP.currentPost.get('id')).toBe(0);
        });
    });

    describe('Date.prototype', function () {
        beforeEach(function () {
        });

        it('Date.timeAgo should format for hours', function(){
            oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);
            expect(oneHourAgo.timeAgo()).toBe('1 hour ago');
        });

        it('Date.timeAgo should format for just now', function(){
            justNow = new Date();
            expect(justNow.timeAgo()).toBe('just now');
        });
        it('Date.timeAgo should format for yesterday', function(){
            oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            expect(oneDayAgo.timeAgo()).toBe('Yesterday');
        });

        it('Date.timeAgo should format for days', function(){
            twoDayAgo = new Date();
            twoDayAgo.setDate(twoDayAgo.getDate() - 2);
            expect(twoDayAgo.timeAgo()).toBe('2 days ago');
        });
    });

    describe('Get Featured Image', function () {
        beforeEach( function () {
        });

        it('Method should return image matching featured id', function () {
            media = postJsonData.media;
            expect(WisP.getFeaturedImage(123456, media).id).toBe(123456);
        });
        it('Method should return false if id not found', function () {
            media = postJsonData.media;
            expect(WisP.getFeaturedImage(123499, media)).toBe(false);
        });
    });

    describe('Term Model', function () {
        beforeEach(function () {
            this.term = new WisP.Term();
        });
        it('Term default should be set', function () {
            expect(this.term.get('id')).toBe(0);
        });
        it('Term should set given id', function () {
            term = new WisP.Term({id: 1});
            expect(term.get('id')).toBe(1);
        });
    });

    describe('Terms Collection', function () {
        beforeEach(function () {
            this.terms = new WisP.Terms([], {taxonomy: 'category'});
        });

        it('Adding model should add to collection', function () {
            this.terms.add([new WisP.Term]);
            expect(this.terms.models.length).toBe(1);
        });
        it('The url should use variables', function () {
            terms = new WisP.Terms([], {taxonomy: 'category'});
            expect(terms.url).toBe('stubs/taxonomies/category/terms/');
        });
        it('Should add models from remote', function () {
            var result;
            terms = new WisP.Terms();
            getTerms();

            waitsFor(function () {
                return result === true;
            }, 'gets terms', 3000);

            runs(function () {
                expect(terms.models.length).toBe(3);
            });

            function getTerms() {
                terms.fetch({
                    success: function () {
                        result = true;
                    },
                    error: function () {
                        result = false;
                    }
                });

            }

        });
    });

    describe('Category Menu View', function () {
        beforeEach(function () {
            this.terms = new WisP.Terms(taxonomy: 'category'});
            this.$el = $('<div><div class="dropdown-toggle"></div><div class="dropdown-menu"></div></div>');
            this.categoryMenuView = new WisP.CategoryMenuView({collection: this.terms, el: this.$el});
        });
        it('Adding a model should render html', function () {
            html = this.categoryMenuView.renderOne(new WisP.Term({id: 1, name:'Test Taxonomy Name'}));
            expect($(html).find('li a').text()).toBe('Test Taxonomy Name');
        });
        it('Should render from remote', function () {
            var result,
            _this = this;
            getCats();
            waitsFor(function () {
                return result === true;
            }, "get cats", 3000);

            runs(function () {
                expect($(_this.categoryMenuView.el).find('li').length).toBe(3);
            });

            function getCats() {
                _this.terms.fetch({
                    success: function () {
                        result = true;
                    },
                    error: function () {
                        result = false;
                    }
                })
            }
        });
    });
});