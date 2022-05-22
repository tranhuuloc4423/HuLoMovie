$(function() {
    const api_control = {
        api_key: 'api_key=c4e5bfcfac4db467da2406d59dbc5dc2',
        base_url: 'https://api.themoviedb.org/3',
        img_url: 'https://image.tmdb.org/t/p/w300',
        backdrop_url: 'https://image.tmdb.org/t/p/original',
        lang: '&language=vi',
        year: '&year=',
        genre: '&with_genres=',
        api_trending() {
            return this.base_url + '/trending/movie/week?' + this.api_key + this.lang
        },

        api_search() {
            return this.base_url + '/search/movie?' + this.api_key + this.lang
        },

        api_discover() {
            return 'https://api.themoviedb.org/3/discover/movie?api_key=c4e5bfcfac4db467da2406d59dbc5dc2&language=en-US&sort_by=popularity.desc&page=1&primary_release_date.lte=2010'
        },

        api_movie(key) {
            return this.base_url + `/movie/${key}?` + this.api_key + this.lang
        },

        api_genre(genre) {
            return this.base_url + '/discover/movie?' + this.api_key + `${this.genre}${genre}` + this.lang
        },

        api_year(year) {
            return this.base_url + '/discover/movie?' + this.api_key + `${this.year}${year}` + this.lang
        },

        api_video(key) {
            return this.base_url + `/movie/${key}/videos?` + this.api_key
        }
    }

    const genre = [
        {
            id: 28,
            name: "Phim Hành Động"
        },
        {
            id: 12,
            name: "Phim Phiêu Lưu"
        },
        {
            id: 16,
            name: "Phim Hoạt Hình"
        },
        {
            id: 35,
            name: "Phim Hài"
        },
        {
            id: 80,
            name: "Phim Hình Sự"
        },
        {
            id: 99,
            name: "Phim Tài Liệu"
        },
        {
            id: 18,
            name: "Phim Chính Kịch"
        },
        {
            id: 10751,
            name: "Phim Gia Đình"
        },
        {
            id: 14,
            name: "Phim Giả Tượng"
        },
        {
            id: 36,
            name: "Phim Lịch Sử"
        },
        {
            id: 27,
            name: "Phim Kinh Dị"
        },
        {
            id: 10402,
            name: "Phim Nhạc"
        },
        {
            id: 9648,
            name: "Phim Bí Ẩn"
        },
        {
            id: 10749,
            name: "Phim Lãng Mạn"
        },
        {
            id: 878,
            name: "Phim Khoa Học Viễn Tưởng"
        },
        {
            id: 10770,
            name: "Chương Trình Truyền Hình"
        },
        {
            id: 53,
            name: "Phim Gây Cấn"
        },
        {
            id: 10752,
            name: "Phim Chiến Tranh"
        },
        {
            id: 37,
            name: "Phim Miền Tây"
        }
    ]

    const countrys = [
        {
            iso_3166_1: "US",
            english_name: "United States of America",
            native_name: "Hoa Kỳ"
        },
        {
            iso_3166_1: "RU",
            english_name: "Russia",
            native_name: "Nga"
            },
        {
            iso_3166_1: "MX",
            english_name: "Mexico",
            native_name: "Mexico"
        },
        {
            iso_3166_1: "KR",
            english_name: "South Korea",
            native_name: "Hàn Quốc"
        },
        {
            iso_3166_1: "JP",
            english_name: "Japan",
            native_name: "Nhật Bản"
        },
        {
            iso_3166_1: "IT",
            english_name: "Italy",
            native_name: "Ý"
        },
        {
            iso_3166_1: "IN",
            english_name: "India",
            native_name: "Ấn Độ"
        },
        {
            iso_3166_1: "ID",
            english_name: "Indonesia",
            native_name: "Indonesia"
        },
        {
            iso_3166_1: "FR",
            english_name: "France",
            native_name: "Pháp"
        },
        {
            iso_3166_1: "DE",
            english_name: "Germany",
            native_name: "Đức"
        },
        {
            iso_3166_1: "VN",
            english_name: "Vietnam",
            native_name: "Việt Nam"
        },
    ]

    const yearArray = []

    let time = new Date
    const year = time.getFullYear()
    const getDaultYear = year - 10
    for(let i = year; i > getDaultYear; i--) {
        yearArray.push(i)
    }

    const pagination = $('.pagination ul')

    const MOVIE_COLLECTION = 'movie_collection'
    const collection = JSON.parse(localStorage.getItem(MOVIE_COLLECTION)) || []

    const renderCategory = (genre, years) => {
        const genreEle = $('#select_genre')
        const yearEle = $('#select_year')

        genre.map(item => {
            genreEle.append(
                $('<option>', { text: item.name, value: item.id})
            )
        })

        years.map(year => {
            yearEle.append(
                $('<option>', { text: year, value: year})
            )
        })
    }
    renderCategory(genre, yearArray)


    // get genre by movie
    const getGenreByMovie = (genre, element) => {
        for(let i = 0; i < genre.length; i++) {
            element.append(
                $('<span>', { text: genre[i].name })
            )
        }
        return element
    }

    // get country by movie
    const getCountrysByMovie = (element, countryArray, country) => {
        for(let i = 0; i < country.length; i++) {
            for(let j = 0; j < countryArray.length; j++) {
                if(countryArray[j].iso_3166_1 === country[i].iso_3166_1) {
                    element.append(
                        $('<span>', { text: countryArray[j].native_name}),
                    )
                }
            }
        }
        return element
    }

    // render movie infomation detail
    const renderEachMovie = (movie) => {
        $('.nav').css('background', 'transparent')
        $('.container.main').hide()
        $('.movie_detail').show()
        $('.footer').hide()
        $('.movie_detail').append(
            $('<div>', { style: `background-image:url(${api_control.backdrop_url + movie.backdrop_path})`, class: 'movie_detail_backdrop'}),
            $('<div>', { class: 'movie_detail_box'}).append(
                $('<div>', { class: "movie_detail_poster"}).append(
                    $('<img>', { src: api_control.img_url + movie.poster_path}),
                    $('<button>', {class: 'movie_detail_trailer', value: movie.id}).append(
                        $('<span>', { class: 'fa-solid fa-play'}),
                        $('<span>', { text: "Xem trailer"})
                    ) // thêm data để xem trailer
                ),
                $('<div>', { class: "movie_detail_info"}).append(
                    $('<div>').append(
                        $('<h4>', { text: movie.original_title}),
                        $('<h5>', { text: movie.title})
                    ),
                    $('<p>', { text: `Thời lượng phim: ${movie.runtime} phút`}),
                    $('<p>', { text: `Lượt vote trung bình: `}).append(
                        $('<span>', { text: movie.vote_average })
                    ),
                    $('<div>', { class: 'movie_detail_category'}).append(
                        $('<p>', { text: 'Thể loại:'}),
                        getGenreByMovie(movie.genres, $('<div>'))
                    ),
                    $('<button>', { class: 'collection_btn', value: movie.id }).append(
                        $('<span>').append(
                            $('<i>', { class: 'fa-solid fa-plus'})
                        ),
                        $('<span>', { text: 'Bộ sưu tập'})
                    ),
                    $('<div>',{ class: "movie_detail_product"}).append(
                        getCountrysByMovie($('<div>',{text: `Quốc gia: `}), countrys, movie.production_countries),
                        $('<p>', { text: `Khởi chiếu: ${movie.release_date}`})
                    ),
                    $('<p>', { text: movie.overview})
                )
            )
        )

        $('.collection_btn').click(function() {
            let movieKey = Number($(this).attr('value'))
            console.log(movieKey)
            saveToCollection(movieKey)
        })

        $('.movie_detail_trailer').click(function() {
            let movieKey = Number($(this).attr('value'))
            console.log(movieKey)
            showVideo(movieKey)
        })
    }

    const showVideo = (movieKey) => {
        getMovies(api_control.api_video(movieKey), (videos) => {
            $('body').append(
                $('<div>',{ class: 'media_video'}).css({
                    "position": "fixed",
                    "background": "rgba(0, 0, 0, 0.7)",
                    "top": "0",
                    "left": "0",
                    "width": "100vw",
                    "height": "100vh",
                    "z-index": "10000"
                }).append(
                    $('<iframe>', {
                        width: '1000',
                        height: '600',
                        src: `https://www.youtube.com/embed/${videos.results[0].key}`,
                        frameborder: '0',
                        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                        allowfullscreen: 'on'
                    }).css({
                        'position': 'absolute',
                        'left': '50%',
                        'top': '50%',
                        'transform': 'translate(-50%, -50%)'
                    })
                )

                
            )
            $('.media_video').click(function() {
                $(this).remove()
            })
        })
    }

    // save to collection
    const saveToCollection = (movieKey) => {
        let result = confirm('Bạn có muốn lưu vào bộ sưu tập không ?')
        if(!(collection.find(key => key === movieKey))) {
            collection.push(movieKey)
            localStorage.setItem(MOVIE_COLLECTION, JSON.stringify(collection))
        } else {
            alert("Bạn đã có phim này trong bộ sưu tập!!!")
        }
    }

    // render movie interface
    const renderMovies = (data) => {
        let movies = data.results
        const moviesBox = $('.movies')
        let output = ''
        movies.map((movie, index) => {
            const { title , original_title, poster_path, vote_average, id, overview} = movie
            output += `
                <div class="movie-item" value="${id}">
                    <img src="${api_control.img_url + poster_path}" alt="" value="${id}">
                    <div class="movie-item_detail">
                        <h2>${title}</h2>
                        <h3>${original_title}</h3>
                    </div>
                </div>
            `
        })
        moviesBox.html(output)
    }
    
    // call api and get data from result
    const getMovies = (url, callback) => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                callback(data)
            })
            .catch(err => console.log(err))
    }

    // slider movies
    const renderMovieSilder = (data) => {
        let movies = data.results
        const movieSlider = $('.movie-slider_main')
        for(let i = 0; i < 10; i++) {
            movieSlider.append(
                $('<div>',{ class: 'movie-slider-item'}).append(
                    $('<img>', { src: api_control.backdrop_url + movies[i].backdrop_path, class: 'backdrop', value: movies[i].id}),
                    $('<div>',{ class: "movie-slider-item_info"}).append(
                        $('<img>', { src: api_control.img_url + movies[i].poster_path, value: movies[i].id}),
                        $('<p>', { class: "movie-slider-item_detail", text: movies[i].title })
                    )
                )
            )
        }
    }
    getMovies(api_control.api_trending(), renderMovieSilder)

    const sliderMovie = () => {
        const slider = $('.movie-slider_main')
        const itemLen = $('.movie-slider_wrapper').width()
        let len = itemLen
        setInterval(() => {
            if(len > (itemLen * 10) - 1) {
                len = 0
            }
            slider.css({
                "transform": `translateX(-${len}px)`,
                "transition": "transform 1.2s cubic-bezier(0.455, 0.03, 0.515, 0.955)"
            })
            len += itemLen
        }, 5000);
    }
    sliderMovie()

    const collectionMovie = () => {
        const moviesCollection = $('.movie_collection_box')
        collection.forEach((key) => {
            getMovies(api_control.api_movie(key), function(movie) {
                moviesCollection.append(
                    $('<div>', { class: "movie-item", value: movie.id}).append(
                        $('<img>', {src: api_control.img_url + movie.poster_path, value: movie.id}),
                        $('<div>', { class: 'movie-item_detail'}).append(
                            $('<h2>', { text: movie.title })
                        )
                    )
                )
            })
        })
    }
    collectionMovie()

    const searchMovie = () => {
        const searchText = $('#searchText').val()
        if(searchText) {
            
            getMovies(api_control.api_search() + '&query=' + searchText, renderMovies)
        } else {
            getMovies(api_control.api_trending(), renderMovies)
        }

        $('.container.main').show()
        $('.movie_detail').hide()
        $('.container.movie_collection').addClass('hide')
        $('.footer').show()
    }

    const handleEvents = () => {
        $('#searchForm').on('submit', (e) => {
            e.preventDefault()
            searchMovie()
        })
    
        $('#search').click(() => {
            searchMovie()
        })

        $('.search-box').on('click', () => {
            $('.container-full').hide()
            $('.container.main').show()
            $('.movie_detail').hide()
            $('.container.movie_collection').addClass('hide')
            $('.nav').css("background-color", "rgba(47, 10, 98, 0.8)")
            searchMovie()
        })

        function getInfoMovie(e) {
            if($(e.target).attr('value')) {
                let key = Number($(e.target).attr('value'))
                getMovies(api_control.api_movie(key), renderEachMovie)
            }
        }

        // class: movie-item tạo ra trong lúc render
        $('.movies').click((e) => {
            getInfoMovie(e)
        })

        $('.movie-slider_main').click((e) => {
            getInfoMovie(e)
            if($(e.target).attr('value')) {
                $('.container-full').remove()
            }
        })

        $('.movie_collection_box').click((e) => {
            getInfoMovie(e)
            if($(e.target).attr('value')) {
                $('.container.movie_collection').addClass('hide')
            }
        })

        $('#select_genre').on('change', function () {
            let genre = $(this).find('option:selected').attr('value')
            getMovies(api_control.api_genre(genre), renderMovies)
        })

        $('.collection').on('click', () => {
            $('.container-full').hide()
            $('.container.main').hide()
            $('.movie_detail').hide()
            $('.nav').css("background-color", "rgba(47, 10, 98, 0.8)")
            $('.container.movie_collection').removeClass('hide')
        })
    }
    handleEvents()
})