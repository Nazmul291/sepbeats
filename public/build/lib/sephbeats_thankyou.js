var render_html = '<div class="main-loader"><div class="loader"></div></div>'; 
document.querySelectorAll(".step__sections .section__content .content-box")[0].insertAdjacentHTML('afterend', render_html);

function UaioLoadCSSFile(url) {
    var script = document.createElement("link");
    script.rel = "stylesheet";
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
            }
        };
    }
    script.href = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

UaioLoadCSSFile("https://muscled-sepbeats-app.herokuapp.com/lib/sephbeats_thankyou.css");

var samples_ids = [];
function allProductsIds(){
    var order_items = Shopify.checkout.line_items;
    order_items.forEach(function(item){
        samples_ids.push(item.variant_id);
    });
    var request_data = {
        "shop": Shopify.shop,
        "samples_ids": samples_ids
    }
    requestThankyouAPI(request_data);
}

function myCallBack(response) {
    if (response.readyState == 4 && response.status == 200) {
        
        var x = document.querySelectorAll(".main-loader");
        x[0].setAttribute('style', 'display: none !important');

        var line_items = Shopify.checkout.line_items;
        var items = response.response;

        const mergeHelper = new Map(line_items.map(x => [x.variant_id, x]));
        for (const x of items) {
            if (mergeHelper.has(x.sample_id)) {
                const item = mergeHelper.get(x.sample_id);
                mergeHelper.set(x.sample_id, {...item, ...x});
            } else {
                mergeHelper.set(x.sample_id, x);
            }
        }

        const samplesData = [...mergeHelper.values()];
        // For sorted array 
        // const mergedSortedList = [...mergeHelper.values()].sort((a, b) => a.id - b.id);

        console.log(samplesData);
        //Creation of initial elements to display, i:e order_info &  table header
        let orderContainer = document.createElement("div");
        orderContainer.className = "order-details-wrapper";
        orderContainer.innerHTML = `<div class="order-info-container">
        <!-- Order info -->
        <div class="order-info">
        <!-- Logo -->
        <div>
            <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M0 10.6157C0 7.96356 1.05357 5.42002 2.92893 3.54465C4.8043 1.66929 7.34784 0.615723 10 0.615723C12.6522 0.615723 15.1957 1.66929 17.0711 3.54465C18.9464 5.42002 20 7.96356 20 10.6157C20 13.2679 18.9464 15.8114 17.0711 17.6868C15.1957 19.5622 12.6522 20.6157 10 20.6157C7.34784 20.6157 4.8043 19.5622 2.92893 17.6868C1.05357 15.8114 0 13.2679 0 10.6157ZM8.75 7.49072C8.75 7.32496 8.68415 7.16599 8.56694 7.04878C8.44973 6.93157 8.29076 6.86572 8.125 6.86572C7.95924 6.86572 7.80027 6.93157 7.68306 7.04878C7.56585 7.16599 7.5 7.32496 7.5 7.49072V13.7407C7.5 13.9065 7.56585 14.0655 7.68306 14.1827C7.80027 14.2999 7.95924 14.3657 8.125 14.3657C8.29076 14.3657 8.44973 14.2999 8.56694 14.1827C8.68415 14.0655 8.75 13.9065 8.75 13.7407V7.49072ZM5 8.11572C4.83424 8.11572 4.67527 8.18157 4.55806 8.29878C4.44085 8.41599 4.375 8.57496 4.375 8.74072V11.2407C4.375 11.4065 4.44085 11.5655 4.55806 11.6827C4.67527 11.7999 4.83424 11.8657 5 11.8657C5.16576 11.8657 5.32473 11.7999 5.44194 11.6827C5.55915 11.5655 5.625 11.4065 5.625 11.2407V8.74072C5.625 8.57496 5.55915 8.41599 5.44194 8.29878C5.32473 8.18157 5.16576 8.11572 5 8.11572ZM11.25 8.11572C11.0842 8.11572 10.9253 8.18157 10.8081 8.29878C10.6908 8.41599 10.625 8.57496 10.625 8.74072V11.2407C10.625 11.4065 10.6908 11.5655 10.8081 11.6827C10.9253 11.7999 11.0842 11.8657 11.25 11.8657C11.4158 11.8657 11.5747 11.7999 11.6919 11.6827C11.8092 11.5655 11.875 11.4065 11.875 11.2407V8.74072C11.875 8.57496 11.8092 8.41599 11.6919 8.29878C11.5747 8.18157 11.4158 8.11572 11.25 8.11572ZM14.375 6.86572C14.2092 6.86572 14.0503 6.93157 13.9331 7.04878C13.8158 7.16599 13.75 7.32496 13.75 7.49072V13.7407C13.75 13.9065 13.8158 14.0655 13.9331 14.1827C14.0503 14.2999 14.2092 14.3657 14.375 14.3657C14.5408 14.3657 14.6997 14.2999 14.8169 14.1827C14.9342 14.0655 15 13.9065 15 13.7407V7.49072C15 7.32496 14.9342 7.16599 14.8169 7.04878C14.6997 6.93157 14.5408 6.86572 14.375 6.86572Z"
                fill="black"
            />
            </svg>
        </div>
        <div class="order-price_num_wrapper">
            <!-- Order num -->
            <p class="order-num">Order #<span class="order-num-no"></span></p>
            <!-- Order price -->
            <p class="order-price">${Shopify.currency.active}${Shopify.checkout.total_price}</p>
        </div>
        </div>
        <!-- Order actions -->
        <div class="order-actions">
        <button class="download-all-button">Download All Files</button>
        </div>
        </div>
        <div class="order-data_table-wrapper">
        <!-- Data table -->
        <table id="samples_table">
        <!-- Table header -->
        <tr class="table-header">
            <th>Play</th>
            <th>Love Samples</th>
            <th>Producer</th>
            <th>Order</th>
            <th>Action</th>
        </tr>
        <!--Pack Samples -->
        </table>
        </div>
        </div> `;

        //appending initial element to body
        document.body.appendChild(orderContainer);
        document.querySelectorAll(".step__sections .section__content .content-box")[0].after(orderContainer);
        //table element
        let table = document.getElementById("samples_table");

        //creating audio player to play audios
        let audioPlayer = new Audio();

        samplesData.forEach((sample, index) => {
        let sampleRow = document.createElement("tr");
        sampleRow.innerHTML = `<tr>
        <td>
        <div class="play-pause-button">
        <div class="play-button">  
        <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M8 7.325V12.675C8 13.0583 8.175 13.35 8.525 13.55C8.875 13.75 9.21667 13.7333 9.55 13.5L13.7 10.85C14.0167 10.65 14.175 10.3667 14.175 10C14.175 9.63333 14.0167 9.35 13.7 9.15L9.55 6.5C9.21667 6.26667 8.875 6.25 8.525 6.45C8.175 6.65 8 6.94167 8 7.325ZM10.5 20C9.11667 20 7.81667 19.7373 6.6 19.212C5.38333 18.6873 4.325 17.975 3.425 17.075C2.525 16.175 1.81267 15.1167 1.288 13.9C0.762667 12.6833 0.5 11.3833 0.5 10C0.5 8.61667 0.762667 7.31667 1.288 6.1C1.81267 4.88333 2.525 3.825 3.425 2.925C4.325 2.025 5.38333 1.31233 6.6 0.787C7.81667 0.262333 9.11667 0 10.5 0C11.8833 0 13.1833 0.262333 14.4 0.787C15.6167 1.31233 16.675 2.025 17.575 2.925C18.475 3.825 19.1873 4.88333 19.712 6.1C20.2373 7.31667 20.5 8.61667 20.5 10C20.5 11.3833 20.2373 12.6833 19.712 13.9C19.1873 15.1167 18.475 16.175 17.575 17.075C16.675 17.975 15.6167 18.6873 14.4 19.212C13.1833 19.7373 11.8833 20 10.5 20Z"
                fill="black"
            />
            </svg>
            </div>
            <div class="pause-button" style="display:none">
            <svg fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 512 512" xml:space="preserve">
        <path d="M256,0C114.617,0,0,114.615,0,256s114.617,256,256,256s256-114.615,256-256S397.383,0,256,0z M224,320
        c0,8.836-7.164,16-16,16h-32c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h32c8.836,0,16,7.164,16,16V320z M352,320
        c0,8.836-7.164,16-16,16h-32c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h32c8.836,0,16,7.164,16,16V320z"/>
        </svg>
            </div>
            </div>
        </td>
        <td class="sample-title">
        <div class="sample-pack-name-container">
        <p class="sample">${sample.variant_title}</p>
        <p class="sample-title-pack">${sample.title}</p>
        </div>
        </td>
        <td class="sample-title">${sample.vendor}</td>
        <td class="sample-order-no"></td>
        <td>
        <a class="sample-download-button" download >
            <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                d="M5.5 20H19.5V18H5.5V20ZM19.5 9H15.5V3H9.5V9H5.5L12.5 16L19.5 9Z"
                fill="black"
            />
            </svg>
            </a>
        </td>
        </tr>`;

        let downloadButton = sampleRow.querySelector(".sample-download-button");
        fetchAudioUrl(sample.filesUrl, sample.variant_title, downloadButton);

        let playPauseButton = sampleRow.querySelector(".play-pause-button");

        //Play pause button click listner for playing corresponding sample audio
        playPauseButton.addEventListener("click", (e) => {
            handlePlayPause(e, sample.filesUrl);
        });

        //appending sample row
        table.appendChild(sampleRow);
        });

        // Function for handling play and pause & changing styles button for  sample
        function handlePlayPause(e, audioSrc) {
        const playButton = e.currentTarget.querySelector(".play-button");
        const pauseButton = e.currentTarget.querySelector(".pause-button");

        if (e.currentTarget.classList.contains("active")) {
            if (audioPlayer.paused) {
            audioPlayer.play();
            pauseButton.style.display = "block";
            playButton.style.display = "none";
            } else {
            audioPlayer.pause();
            pauseButton.style.display = "none";
            playButton.style.display = "block";
            }
        } else {
            let previousActive = table.querySelector(".play-pause-button.active");
            if (previousActive) {
            previousActive.classList.remove("active");
            const previousPlayButton = previousActive.querySelector(".play-button");
            const previousPauseButton = previousActive.querySelector(".pause-button");
            previousPauseButton.style.display = "none";
            previousPlayButton.style.display = "block";
            }
            e.currentTarget.classList.add("active");
            audioPlayer.src = audioSrc;
            audioPlayer.play();
            pauseButton.style.display = "block";
            playButton.style.display = "none";
        }
        }

        //Function for fetching audio url and setting href attribute to download button
        async function fetchAudioUrl(url, name, downloadButton) {
        downloadButton.style.pointerEvents = "none";
        let res = await fetch(url);
        let blob = await res.blob();
        let audioFile = new File([blob], name, { type: blob.type });
        let href = URL.createObjectURL(audioFile);
        downloadButton.href = href;
        downloadButton.setAttribute("download", `${name}`);
        downloadButton.style.pointerEvents = "auto";
        }

        //Multiple Sample Downloads
        const downloadAllButton = document.querySelector(
        ".order-actions .download-all-button"
        );

        const sampleDownloadButtons = Array.from(
        table.querySelectorAll(".sample-download-button")
        );

        downloadAllButton.addEventListener("click", () => {
        sampleDownloadButtons.forEach((button) => {
            button.click();
        });
        });

        //Creation of datatable footer for view more/less functionality
        let dataTableFooter = document.createElement("div");
        dataTableFooter.className = "data_table-footer";
        dataTableFooter.innerHTML = `
        <button class="view-samples-button view-all-button">View All</button>
        <button class="view-samples-button view-less-button" style="display:none">View Less</button>
        `;
        let viewAllButton = dataTableFooter.querySelector(".view-all-button");
        let viewLessButton = dataTableFooter.querySelector(".view-less-button");

        viewAllButton.addEventListener("click", toggleSamples);
        viewLessButton.addEventListener("click", toggleSamples);

        //Function for toggling b/w view all and view less samples
        function toggleSamples() {
        var items = document.querySelectorAll(
            "table#samples_table tr:nth-child(n+5)"
        );

        for (var i = 0; i < items.length; i++) {
            items[i].style.display =
            getComputedStyle(items[i]).display === "none" ? "table-row" : "none";
        }

        viewAllButton.style.display =
            viewAllButton.style.display === "none" ? "block" : "none";
        viewLessButton.style.display =
            viewLessButton.style.display === "none" ? "block" : "none";
        viewAllButton.innerHTML =
            viewAllButton.style.display === "none" ? "View Less" : "View All";
        }

        orderContainer.appendChild(dataTableFooter);
        var order_text = document.getElementsByClassName("os-order-number")[0].innerText.split("#")[1];
        x=document.querySelectorAll(".order-num-no,.sample-order-no");
        for(var i = 0; i < x.length; i++){
            x[i].innerText=order_text;
        }
        // var render_html = '<h1 style="text-align: center; margin: 3rem 0;">HERE WILL BE OUR TABLE OF SAMPLES</h1>';
        // document.querySelectorAll(".step__sections .section__content .content-box")[0].insertAdjacentHTML('afterend', orderContainer);
    }
}

allProductsIds();
function requestThankyouAPI(request_data){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.responseType = 'json';
    xmlhttp.open("POST", "https://muscled-sepbeats-app.herokuapp.com/api/get_thankyou");
    xmlhttp.onreadystatechange = function () {
        myCallBack(xmlhttp);
    };
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "https://muscled-sepbeats-app.herokuapp.com");
    xmlhttp.setRequestHeader("Accept", "application/json");
    xmlhttp.send(JSON.stringify(request_data));
}