WisP.Controller =

  showCategoriesMenu: (opts)->
    WisP.categories = new WisP.Terms [], opts
    categoryMenuView = new WisP.CategoryMenuView
      collection: WisP.categories
      el: WisP.config.html.categorySelect

    WisP.categories.fetch()

  showPosts: (category, paged)->
    opts =
      category : null
      paged : 1
    if category? then opts.category = category
    if paged? then opts.paged = paged
    WisP.config.html.main.append(@morePosts(opts))

  morePosts: (opts)->
    WisP.currentPosts = new WisP.Posts([], opts)
    postsView = new WisP.PostArchiveView(collection : WisP.currentPosts)
    WisP.currentPosts.fetch(success: () ->
      WisP.loadingPosts = false
    )
    postsView.listenTo(WisP.currentPosts, 'add', postsView.renderOne)
    postsView.el

  showPost: (id)->
    WisP.currentPost = new WisP.Post(id: id)
    postView = new WisP.PostView(model:WisP.currentPost)
    WisP.currentPost.fetch()
    postView.listenTo(WisP.currentPost, 'change', postView.render)
    WisP.config.html.popup.html(postView.el)