var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"home","component":"HomeComponent"},{"path":"register","component":"RegisterComponent"},{"path":"login","component":"LoginComponent"},{"path":"account","canActivate":["AuthGuard"],"children":[{"path":":key","component":"AccountComponent"},{"path":"","component":"AccountComponent"}]},{"path":"profile","canActivate":["AuthGuard"],"children":[{"path":":key","component":"ProfileComponent"},{"path":"","component":"ProfileComponent"}]},{"path":"postarticle","canActivate":["AuthGuard"],"component":"PostArticleComponent"},{"path":"editarticle/:key","canActivate":["AuthGuard"],"component":"EditArticleComponent"},{"path":"articledetail/:key","component":"ArticleDetailComponent"},{"path":"articlehistory/:key","component":"ArticleHistoryComponent"},{"path":"articlesearch","children":[{"path":":query","component":"ArticleSearchResultsComponent"},{"path":"","component":"ArticleSearchResultsComponent"}]},{"path":"suggestions","component":"SuggestionsComponent"},{"path":"postsuggestion","canActivate":["AuthGuard"],"component":"AddSuggestionComponent"},{"path":"suggestion/:key","component":"SuggestionDetailComponent"},{"path":"editsuggestion/:key","canActivate":["AuthGuard"],"component":"EditSuggestionComponent"},{"path":"aboutus","component":"AboutUsComponent"},{"path":"chat","component":"ChatComponent"},{"path":"users","component":"UserListComponent"},{"path":"datacleanup","component":"DataCleanupComponent"},{"path":"","component":"HomeComponent"},{"path":"**","component":"PageNotFoundComponent"}],"kind":"module"}]}