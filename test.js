for (var i = 0; i < 10; i++) {
	setTimeout((i => () => console.log(i))(i), 100);
}
