import { Layout, Popover, TopBar, Frame, Badge, RangeSlider, SkeletonBodyText, ButtonGroup, MediaCard, VideoThumbnail, DataTable, Button, EmptyState, Card, Page, TextField, Icon, Stack, Avatar, Image, Modal, FormLayout, Select,  DropZone, Thumbnail, TextStyle, Pagination } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { useNavigationHistory, useToast } from "@shopify/app-bridge-react";
import { Axios } from  "../Axios";
// import Divider from '@mui/material/Divider';

import store from "store2";
import { ChevronDownMinor, SearchMinor, NoteMinor, SearchMajor, DeleteMajor, EditMajor, FolderDownMajor, ArrowLeftMinor } from "@shopify/polaris-icons";
import { useNavigate, useParams } from "react-router";
import { announceIcon, notification, closeImage } from '../assets';
import music1 from "../assets/music-svgrepo-com.png";
import logo1 from "../assets/logo.png";
import music_emptyState from "../assets/music_emptyState.png";
  
export default function PackPage() {
    const { id } = useParams();
    const { show } = useToast();
    const {replace} = useNavigationHistory();
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [delete_modal_active, setDeleteModalActive] = useState(false);
    const [active, setActive] = useState(true);
    const handleChange = useCallback(() => setActive(!active), [active]);

    const [edit_active, setEditActive] = useState(true);
    const handleEditChange = useCallback(() => setEditActive(!edit_active), [edit_active]);

    const [add_pack, setAddPack] = useState(true);
    const [edit_pack, setEditPack] = useState(true);
    const handleAddPack = useCallback(() => setAddPack(!add_pack), [add_pack]);
    const handleEditPack = useCallback(() => setEditPack(!edit_pack), [edit_pack]);

    const [delete_sample_id, setDeleteSampleId] = useState(null);
    let [editPriceChecked, setEditPriceChecked] = useState(false);

    const [searchValue, setSeachValue] = useState("");
    const searchInputOnChange = useCallback((searchValue) => setSeachValue(searchValue),[searchValue]);
    const [searchType, setSeachType] = useState("");
    const searchTypeOnChange = useCallback((searchType) => setSeachType(searchType),[searchType]);

    const [updating_product, setUpdatingProduct] = useState(false);

    const [files, setFiles] = useState([]);

    const [products, setProducts] = useState(fake_products);
    const [creating_product, setCreatingProduct] = useState(false);
    const [editing_product, setEditingProduct] = useState(false);

    const [price, setPrice] = useState("00");
    const [samples_count, setSamplesCount] = useState("0");
    const [description, setDescription] = useState("");
    const [cover_url, setCoverUrl] = useState("");
    const [edit_cover_url, setEditCoverUrl] = useState("");
    const [title_name, setTitleName] = useState("");
    const [genre, setGenre] = useState("");
    const [current_page, setPage] = useState(1);
    const [pagination, setPagination] = useState(default_pagination);

    const [edit_price, setEditPrice] = useState('00');
    const [edit_description, setEditDescription] = useState("");
    const [edit_title_name, setEditTitleName] = useState("");
    const [edit_genre, setEditGenre] = useState("");
    

    const handleDescription = useCallback((description) => {setDescription(description)},[description]);
    const handleTitleName = useCallback((title_name) => {setTitleName(title_name)},[title_name]);
    const handleGenre = useCallback((genre) => {setGenre(genre)},[genre]);
    const handlePrice = useCallback((price) => {setPrice(price)},[price]);

    const handleEditDescription = useCallback((edit_description) => {setEditDescription(edit_description)},[edit_description]);
    const handleEditTitleName = useCallback((edit_title_name) => {setEditTitleName(edit_title_name)},[edit_title_name]);
    const handleEditGenre = useCallback((edit_genre) => {setEditGenre(edit_genre)},[edit_genre]);
    const handleEditPrice = useCallback((edit_price) => {setEditPrice(edit_price)},[edit_price]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [selected, setSelected] = useState(0);

    const [deleting_sample, setDeletingSample] = useState(false);

    const [pack_id, setPackId] = useState("");
    const [image_src, setImageSrc] = useState(music1);
    const [product_id, setProductId] = useState("");

    const [popoverActive, setPopoverActive] = useState(false);

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    const [type_selected, setTypeSelected] = useState("all")
    const handleTypeSelectChange = useCallback(type_selected => setTypeSelected(type_selected), [])

    const types = [
        {label: 'Type', value: 'all'},
        {label: 'Melodic', value: 'melodic'},
        {label: 'Emotional', value: 'emotional'},
        {label: 'Lofi', value: 'lofi'},
        {label: 'Rock', value: 'rock'},
        {label: 'Dark', value: 'dark'}
    ];

    const [sort_selected, setSortSelected] = useState("all")
    const handleSortSelectChange = useCallback(sort_selected => setSortSelected(sort_selected), [])

    const sorts = [
        {label: 'Sort By', value: 'all'},
        {label: 'Title', value: 'title'},
        {label: 'Type', value: 'type'},
        {label: 'Price', value: 'price'}
    ];

  const [tagValue, setTagValue] = useState('');

  const handleTagValueChange = useCallback(value => setTagValue(value), [])


    const initialValue = [0, 200];
  const min = 0;
  const max = 200;
  const step = 10;

  const [intermediateTextFieldValue, setIntermediateTextFieldValue] =
    useState(initialValue);
  const [rangeValue, setRangeValue] = useState(initialValue);

  const handleRangeSliderChange = useCallback((value) => {
    setRangeValue(value);
    setIntermediateTextFieldValue(value);
  }, []);

  const handleLowerTextFieldChange = useCallback(
    (value) => {
      const upperValue = rangeValue[1];
      setIntermediateTextFieldValue([parseInt(value, 10), upperValue]);
    },
    [rangeValue],
  );

  const handleUpperTextFieldChange = useCallback(
    (value) => {
      const lowerValue = rangeValue[0];
      setIntermediateTextFieldValue([lowerValue, parseInt(value, 10)]);
    },
    [rangeValue],
  );

  const handleLowerTextFieldBlur = useCallback(() => {
    const upperValue = rangeValue[1];
    const value = intermediateTextFieldValue[0];

    setRangeValue([value, upperValue]);
  }, [intermediateTextFieldValue, rangeValue]);

  const handleUpperTextFieldBlur = useCallback(() => {
    const lowerValue = rangeValue[0];
    const value = intermediateTextFieldValue[1];

    setRangeValue([lowerValue, value]);
  }, [intermediateTextFieldValue, rangeValue]);

  const handleEnterKeyPress = useCallback(
    event => {
      const newValue = intermediateTextFieldValue
      const oldValue = rangeValue
  
      if (event.key === "Enter" && newValue !== oldValue) {
        setRangeValue(newValue)
      }
    },
    [intermediateTextFieldValue, rangeValue]
  )  

  const lowerTextFieldValue =
    intermediateTextFieldValue[0] === rangeValue[0]
      ? rangeValue[0]
      : intermediateTextFieldValue[0];

  const upperTextFieldValue =
    intermediateTextFieldValue[1] === rangeValue[1]
      ? rangeValue[1]
      : intermediateTextFieldValue[1];


    function disableSaveButton() {
        var disabled = false;
        if (!edit_title_name || edit_title_name.trim() === "" || edit_title_name.length < 2)
            disabled = true;
        if (!edit_description || edit_description.trim() === "" || edit_description.length < 2)
            disabled = true;
        if (!edit_cover_url || edit_cover_url.trim() === "" || edit_cover_url.length < 2)
            disabled = true;

        var file_url = edit_cover_url;
        function getExtension(filename) {
            return filename.split(".").pop().split("?v=")[0];
        }
        let extension = getExtension(file_url);
        if(extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "svg" || extension == "webp"){
            // console.log(extension);
            disabled = false;
        }
        else{
            disabled = true;
        }
        return disabled;
    }

    const handleCoverUrl = useCallback((cover_url) => {
        setCoverUrl(cover_url);
        disableSaveButton();
    }, []);

    const handleEditCoverUrl = useCallback((edit_cover_url) => {
        setEditCoverUrl(edit_cover_url);
    }, []);

    function handleAddSample(){
        // useCallback(() => setAddSample(!add_sample), [add_sample]);
        // console.log("product_idaaa: ", id);
        navigate("/add-samples/"+id, {replace: true});
        replace({pathname: "/add-samples/"+id});
    }

    const tabs = [
        {
          id: 'explore_id',
          content: 'Explore',
          accessibilityLabel: 'Explore',
          panelID: 'explore_panel',
        },
        {
            id: 'packs_id',
            content: 'Packs',
            panelID: 'packs_panel',
        },
        {
          id: 'samples_id',
          content: 'Samples',
          panelID: 'samples_panel',
        },
        {
          id: 'selections_id',
          content: 'Selections',
          panelID: 'selections_panel',
        },
      ];

    const [activeStep, setActiveStep] = useState(0);
    const steps = tabs;

    const toggleIsUserMenuOpen = useCallback(
        () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
        [],
    );

    const toggleIsSecondaryMenuOpen = useCallback(
        () => setIsSecondaryMenuOpen((isSecondaryMenuOpen) => !isSecondaryMenuOpen),
        [],
    );

    // const handleSearchResultsDismiss = useCallback(() => {
    //     setIsSearchActive(false);
    //     setSearchValue('');
    // }, []);

    const handleSearchChange = useCallback((value) => {
        setSearchValue(value);
        setIsSearchActive(value.length > 0);
    }, []);

    const handleNavigationToggle = useCallback(() => {
        // console.log('toggle navigation visibility');
    }, []);

    const logo = {
        width: 124,
        topBarSource:
        logo1,
        url: '#',
        accessibilityLabel: 'shephbeats',
    };

    function handleBpmFilter(){
        // console.log("lowerTextFieldValue: ", lowerTextFieldValue);
        // console.log("upperTextFieldValue: ", upperTextFieldValue);
    }

    const handleDropZoneDrop = useCallback( 
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
        setFiles((files) => [...files, ...acceptedFiles]),
        [],
    );

    const handleEditDropZoneDrop = useCallback( 
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
        setFiles((files) => [...files, ...acceptedFiles]),
        [],
    );

    const [samples, setSamples] = useState(fake_products);

    const userMenuMarkup = (
        <TopBar.UserMenu
          actions={[
            {
              items: [{content: 'Back to Shopify', icon: ArrowLeftMinor}],
            },
            {
              items: [{content: 'Community forums'}],
            },
          ]}
          name="Dharma"
          detail="Jaded Pixel"
          initials="D"
          open={isUserMenuOpen}
          onToggle={toggleIsUserMenuOpen}
        />
      );
    
    //   const searchResultsMarkup = (
    //     <ActionList
    //       items={[{content: 'Shopify help center'}, {content: 'Community forums'}]}
    //     />
    //   );
    
        const searchFieldMarkup = (
            <TopBar.SearchField
            // onChange={handleSearchChange}
            // value={searchValue}
            placeholder="Search"
            showFocusBorder
            />
        );
    const secondaryMenuMarkup = (
        <TopBar.Menu
          activatorContent={
            <span className='home-topbar'>
                <Stack>
                    {/* <Button primary onClick={handleChange}>+ Add New Pack</Button> */}
                    <Button monochrome onClick={back}>Back</Button>
                    {/* <Image source={announceIcon} height={14} />
                    <Image source={notification} height={14} />
                    <Avatar customer name="Farrah" />
                    <Icon source={ChevronDownMinor} /> */}
                </Stack>
            </span>
          }
        //   open={isSecondaryMenuOpen}
        //   onOpen={toggleIsSecondaryMenuOpen}
        //   onClose={toggleIsSecondaryMenuOpen}
        //   actions={[
        //     {
        //       items: [{content: 'Community forums'}],
        //     },
        //   ]}
        />
      );

    const topBarMarkup = (
        <TopBar
          showNavigationToggle
        //   userMenu={userMenuMarkup}
          secondaryMenu={secondaryMenuMarkup}
          searchResultsVisible={isSearchActive}
        //   searchField={searchFieldMarkup}
        //   searchResults={searchResultsMarkup}
        //   onSearchResultsDismiss={handleSearchResultsDismiss}
          onNavigationToggle={handleNavigationToggle}
        />
      );

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );
  
  

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !files.length && <DropZone.FileUpload />;
    const uploadedFiles = files.length > 0 && (
        <div style={{padding: '0'}}>
            <Stack vertical>
                {files.map((file, index) => (
                <Stack alignment="center" key={index}>
                    <Thumbnail
                    size="small"
                    alt={file.name}
                    source={
                        validImageTypes.includes(file.type)
                        ? window.URL.createObjectURL(file)
                        : NoteMinor
                    }
                    />
                    <div>
                    {file.name}{' '}
                    <TextStyle ext variant="bodySm" as="p">
                        {file.size} bytes
                    </TextStyle>
                    </div>
                </Stack>
                ))}
            </Stack>
        </div>
    );

    const editFileUpload = !files.length && <DropZone.FileUpload />;
    const editUploadedFiles = files.length > 0 && (
        <div style={{padding: '0'}}>
            <Stack vertical>
                {files.map((file, index) => (
                <Stack alignment="center" key={index}>
                    <Thumbnail
                    size="small"
                    alt={file.name}
                    source={
                        validImageTypes.includes(file.type)
                        ? window.URL.createObjectURL(file)
                        : NoteMinor
                    }
                    />
                    <div>
                    {file.name}{' '}
                    <TextStyle ext variant="bodySm" as="p">
                        {file.size} bytes
                    </TextStyle>
                    </div>
                </Stack>
                ))}
            </Stack>
        </div>
    );

    useEffect(() => {
        getPack();
    }, []);

    function DeleteSample(){
        setDeletingSample(true);
        setPage(1);
        Axios({
          type: "delete",
          url: "/merchant/sample/delete?id="+delete_sample_id+"&shop="+store("shop"),
          headers: {
            'Content-Type': 'application/json'
          },
        }, function(error, deleted){
          setDeleteModalActive(false);
          getPack();
          setLoading(true);
          setDeletingSample(false);
        });  
      }

    function getPack(){
        // console.log("_id",id);
        getSamples(id);
        Axios({
            type: "get",
            url: "/merchant/get_pack?pack_id="+id+"&shop="+store("shop"),
            headers: {
                'Content-Type': 'application/json'
            },
        }, function(error, pack){
            console.log("pack", pack);
            if (pack && pack.product_response && pack.product_response.variants && pack.product_response.variants.edges[0] && pack.product_response.variants.edges[0].node && pack.product_response.variants.edges[0].node.price) {
                // console.log("pack", pack);
                // console.log("pack.variants.edges[0].node.price", pack.product_response.variants.edges[0].node.price);
                setEditTitleName(pack.product_response.title);
                setEditGenre(pack.product_response.genre);
                setEditCoverUrl(pack.product_response.featuredImage.url);
                setEditPrice(pack.product_response.variants.edges[0].node.price);
                setEditDescription(pack.product_response.description);
                setPackId(pack.product_response.legacyResourceId);
                setImageSrc(pack.product_response.featuredImage.url);
                setProductId(pack.product_response.legacyResourceId);
                // setSamplesCount(pack.samples_count);
            }
            else{
                console.error(error);
            }
        });
    }
    function getSamples(pack_id){
        // console.log("pack_id", pack_id);
        Axios({
            type: "get",
            url: "/merchant/get_all_samples?shop="+store("shop")+"&product_id="+pack_id,
            headers: {
            'Content-Type': 'application/json'
            },
        }, function(error, variants){
            if (variants) {
                if(variants){
                    console.log("variants: ", variants);
                    setSamplesCount(variants.length);
                    // let output = variants.filter(obj => Object.keys(obj).includes("_doc"));
                    // console.log("All samples: ", JSON.parse(output[0].node.metafields.edges[0].node.value).bpm);
                    setSamples(variants);
                    // here(data);
                    // setTitleName(data.products.collections.title_name);
                    setLoading(false);
                }
                else{
                    setSamples([]);
                }
                // if(data && data.paginate){
                //     setPagination(data.paginate);    
                // }
            }
            else{
                setSamples([]);
                console.error(error);
            }
            // setLoading(false);  
        });
    }

    function back() {
        navigate("/", {replace: true});
        replace({pathname: '/'});
    }

    function deletePack(){
        setLoading(true);
        show("Deleting Pack !");
        // console.log("_id",id);
        Axios({
            type: "delete",
            url: "/merchant/delete_pack?id="+id+"&shop="+store("shop"),
            headers: {
                'Content-Type': 'application/json'
            },
        }, function(error, pack){ 
            // console.log("pack pack", pack);
            // console.log("error", error);
            if (pack) {
                navigate("/", {replace: true});
                replace({pathname: '/'});
                show("Pack Deleted !");
            }
            else{
                console.error(error);
            }
            setLoading(false);
        });
    }

    function updatePackAPI(){
        setEditActive(true);
        setLoading(true);
        var update_pack = {
            shop: store("shop"),
            title: edit_title_name,
            genre: edit_genre,
            price: edit_price,
            cover_url: edit_cover_url,
            description: edit_description
        };
        Axios(
            {
                type: "put",
                url: "/merchant/update_pack?id=" + id,
                data: JSON.stringify(update_pack),
                headers: {
                    "Content-Type": "application/json",
                },
            },
            function (error, updated) {
                // console.log("updated", updated);
                if (error) {
                    setLoading(false);
                } else {
                    setLoading(false);
                    show("Pack Updated Successfully !");
                }
            }
        );
    }

    function createProductAPI() {
        setLoading(true);
        // const file_name = files[0].name;
        // console.log("files: ", files);
        show("Creating Pack !");
        setActive(false);

        setCreatingProduct(true);
        setPage(1);
        // console.log("ss", files[0]);
        const fd = new FormData();
        if (files) {
            fd.append('image', files[0]);
        }

        fd.append('title', title_name);
        fd.append('description', description);
        fd.append('genre', genre);
        fd.append('shop', store("shop"));
        Axios(
            {
                type: "post",
                url: "/merchant/add_product",
                data: fd,
                // headers: {
                //     "Content-Type": "application/json",
                // },
            },
            function (error, success) {
                if (error) {
                    setUpdatingProduct(false);
                } else {
                    // console.log("here");
                    // console.log("success",success);
                    if (success && success.success && success.success._id) {
                        setCreatingProduct(false);
                        setActive(true);
                        show("Pack Created Successfully");
                        getProducts(1);
                        setProducts(false);
                        setLoading(false);
                    }
                }
            }
        );
    }

    function getProducts(page){
        Axios({
            type: "get",
            url: "/merchant/products?shop="+store("shop")+"&page="+page,
            headers: {
            'Content-Type': 'application/json'
            },
        }, function(error, data){
            if (data) {
                if(data && data.collections){
                    // console.log("data.collections", data.collections);
                    setProducts(data.collections);
                }
                else{
                    setProducts([]);
                }
                if(data && data.paginate){
                    // console.log("", data.paginate);
                    setPagination(data.paginate);    
                }
            } 
            else{
                setProducts([]);
                console.error(error);
            }
            setLoading(false);
        });
    }

    const searchIcon = <Icon source={SearchMinor} />;
    if (loading) {
        return (
            <Page fullWidth>
                <Card>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                </Card>
                <Card>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                    <Card.Section>
                        <SkeletonBodyText lines={1}></SkeletonBodyText>
                    </Card.Section>
                </Card>
            </Page>
        )
    }

    // function here(samples){
    if(samples.length > 0){
        return (
            <div className='shephbeats-pack-page'>
                <Page fullWidth>
                    <Frame topBar={topBarMarkup} logo={logo}>
                        <Layout>
                            <Layout.Section>
                                <Card>
                                    <Card.Section>
                                        <div className="product-details-card">
                                            <MediaCard
                                                // description={
                                                //     <span className="downloads-sales" style={{display:"flex"}}>
                                                //         <span className="downloads">Downloads: <p className="downloads-k">5.55k</p></span>
                                                //         <p className="sales">Sales: <p className="sales-k">$15.45k</p></p>
                                                //     </span>
                                                // }
                                            >
                                                <VideoThumbnail
                                                    thumbnailUrl={edit_cover_url}
                                                />
                                                <div className="product-details">
                                                    <span className="product-title">{edit_title_name}</span>
                                                    <div className="genre-price-edit">
                                                        <span className="product-genre">{edit_genre}</span>
                                                        <span className="product-price">{"$ "+edit_price}</span>
                                                        <span className="product-edit" onClick={handleEditChange}>Edit Pack Details</span>
                                                    </div>
                                                    <div className="samples-left">
                                                        <span className="samples-text">*This pack can hold 250 samples, {samples_count} added and {250-samples_count} left</span>
                                                    </div>
                                                    <div className="product-description">
                                                        {edit_description}
                                                    </div>
                                                    <div className="add-delete-btns">
                                                        <ButtonGroup>
                                                            <Button primary onClick={handleAddSample}>+ Add Samples</Button>
                                                            <Button destructive onClick={deletePack}>Delete</Button>
                                                            <Button monochrome onClick={back}>Back</Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </div>
                                            </MediaCard>
                                            <p className="file-extension">png, jpg, svg, jpeg</p>
                                        </div>
                                    </Card.Section>
                                    <Card.Section>
                                        <Stack vertical spacing="extraLoose">
                                        <Stack.Item>
                                            <div className="sephbeats-filters">
                                                <div className="sephbeats-filter-search">
                                                    <TextField
                                                        labelHidden
                                                        label="Search"
                                                        prefix={<Icon source={SearchMajor}></Icon>}
                                                        value={searchValue}
                                                        onChange={searchInputOnChange}
                                                        placeholder="Filter"
                                                    />
                                                </div>
                                                <div className="sephbeats-filter-bpm">
                                                    <div>
                                                        <Popover
                                                            active={popoverActive}
                                                            ariaHaspopup={false}
                                                            sectioned
                                                            activator={<Button onClick={togglePopoverActive} disclosure>
                                                            BPM
                                                        </Button>}
                                                            autofocusTarget="first-node"
                                                            onClose={togglePopoverActive}
                                                        >
                                                            <Card title="BPM"
                                                                >
                                                                <Card.Section>
                                                                <div onKeyDown={handleEnterKeyPress}>
                                                                    <RangeSlider
                                                                    output
                                                                    value={rangeValue}
                                                                    min={min}
                                                                    max={max}
                                                                    step={step}
                                                                    onChange={handleRangeSliderChange}
                                                                    />
                                                                    <Stack distribution="equalSpacing" spacing="extraLoose">
                                                                    <TextField
                                                                        type="number"
                                                                        value={`${lowerTextFieldValue}`}
                                                                        min={min}
                                                                        max={max}
                                                                        step={step}
                                                                        onChange={handleLowerTextFieldChange}
                                                                        onBlur={handleLowerTextFieldBlur}
                                                                        autoComplete="off"
                                                                    />
                                                                    <TextField
                                                                        type="number"
                                                                        value={`${upperTextFieldValue}`}
                                                                        min={min}
                                                                        max={max}
                                                                        step={step}
                                                                        onChange={handleUpperTextFieldChange}
                                                                        onBlur={handleUpperTextFieldBlur}
                                                                        autoComplete="off"
                                                                    />
                                                                    </Stack>
                                                                </div>
                                                                </Card.Section>
                                                            </Card>
                                                        </Popover>
                                                    </div>
                                                </div>
                                                <div className="sephbeats-filter-key">
                                                    <Select
                                                        options={types}
                                                        onChange={handleTypeSelectChange}
                                                        value={type_selected}
                                                    />
                                                </div>
                                                <div className="sephbeats-filter-sort">
                                                    <Select
                                                        options={sorts}
                                                        onChange={handleSortSelectChange}
                                                        value={sort_selected}
                                                    />
                                                </div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </Stack.Item>
                                        <Stack.Item>
                                            <DataProductsTable
                                                searchValue={searchValue}
                                                searchType={searchType}
                                                type_selected={type_selected}
                                                sort_selected={sort_selected}
                                                lowerTextFieldValue={lowerTextFieldValue}
                                                upperTextFieldValue={upperTextFieldValue}
                                                rows={samples}
                                                pack_id={pack_id}
                                                products={samples}
                                                callback={(f_products) => {
                                                    setSamples(f_products);
                                                    setLoading(true);
                                                }}
                                                onEditClick={() => {
                                                    setLoading(false);
                                                    setPage(1);
                                                    getSamples();
                                                }}
                                                onDeleteClick={(item) => {
                                                    // console.log("item", item);
                                                    setDeleteSampleId(item.node.id.split("gid://shopify/ProductVariant/")[1]);
                                                    setDeleteModalActive(true);
                                                    }}
                                            ></DataProductsTable>
                                        </Stack.Item>
                                        </Stack>
                                    </Card.Section>
                                </Card>
                            </Layout.Section>
                            <Layout.Section>
                                <Stack alignment="center" distribution="center">
                                <Pagination
                                    hasNext={pagination.next_page}
                                    hasPrevious={pagination.prev_page}
                                    onNext={() => {
                                    var nxt_pg = current_page + 1;
                                    setPage(nxt_pg);
                                    getProducts(nxt_pg);
                                    }}
                                    onPrevious={() => {
                                    var prv_pg = current_page - 1;
                                    setPage(prv_pg);
                                    getProducts(prv_pg);
                                    }}
                                ></Pagination>
                                </Stack>
                            </Layout.Section>
                            <Layout.Section></Layout.Section>
                        </Layout>
                    </Frame>
                </Page>
                <Modal
                    open={!active} 
                    onClose={handleChange}
                    title="PACK DETAILS"
                    primaryAction={{
                        content: 'Save',
                        onAction: () => {
                            setCreatingProduct(true);
                            createProductAPI();
                        },
                    }}
                >
                    <div className="modal-class">
                        <Modal.Section>
                            <FormLayout>
                                <FormLayout.Group>
                                    <Stack vertical>
                                        <TextField
                                            label=""
                                            value={title_name}
                                            onChange={handleTitleName}
                                            placeholder="Pack Title"
                                        />
                                        {/* <Select
                                            label="Genre"
                                            labelHidden
                                            value={genre}
                                            onChange={handleGenre}
                                            options={[
                                                {
                                                    label: "Products",
                                                    value: "products"
                                                },
                                                {
                                                    label: "Variants",
                                                    value: "variants"
                                                }
                                            ]}
                                        /> */}
                                        <TextField
                                            type="number"
                                            label=""
                                            value={price}
                                            onChange={handlePrice}
                                            prefix="$"
                                            placeholder="Price"
                                            autoComplete="off"
                                        />
                                        <TextField
                                            value={description}
                                            onChange={handleDescription}
                                            multiline={4}
                                            autoComplete="off"
                                            placeholder="Descriptions"
                                        />
                                        <TextField
                                            type="file"
                                            value={cover_url}
                                            onChange={handleCoverUrl}
                                            multiline={2}
                                            autoComplete="off"
                                            label="Cover photo Url (only image)"
                                            helpText="Go to Content > click files > Upload image, copy the link and paste above"
                                        />
                                        {/* <DropZone onDrop={handleDropZoneDrop}>
                                            {uploadedFiles}
                                            {fileUpload}
                                        </DropZone>
                                        <div className="clear_container">
                                            <Stack.Item>
                                                <a className="imageClear">Clear</a>
                                                <Image
                                                    source={closeImage}
                                                    width="9px"
                                                    height="9px"
                                                />
                                            </Stack.Item>
                                        </div> */}
                                    </Stack>
                                </FormLayout.Group>
                            </FormLayout>
                        </Modal.Section>
                    </div>
                </Modal>
                <Modal
                    open={!edit_active}
                    onClose={handleEditChange}
                    title="PACK DETAILS"
                    primaryAction={{
                        content: 'Update',
                        disabled: disableSaveButton(),
                        onAction: () => {
                            setUpdatingProduct(true);
                            updatePackAPI();
                        }, 
                    }}
                >
                    <div className="modal-class">
                        <Modal.Section>
                            <FormLayout>
                                <FormLayout.Group>
                                    <Stack vertical>
                                        <TextField
                                            label=""
                                            value={edit_title_name}
                                            onChange={handleEditTitleName}
                                            placeholder="Pack Title"
                                        />
                                        {/* <Select
                                            label="Genre"
                                            labelHidden
                                            value={edit_genre}
                                            onChange={handleEditGenre}
                                            options={[
                                                {
                                                    label: "Products",
                                                    value: "products"
                                                },
                                                {
                                                    label: "Variants",
                                                    value: "variants"
                                                }
                                            ]}
                                        /> */}
                                        <TextField
                                            type="number"
                                            label=""
                                            value={edit_price}
                                            onChange={handleEditPrice}
                                            prefix="$"
                                            placeholder="Price"
                                            autoComplete="off"
                                        />
                                        <TextField
                                            value={edit_description}
                                            onChange={handleEditDescription}
                                            multiline={4}
                                            autoComplete="off"
                                            placeholder="Descriptions"
                                        />
                                        <TextField
                                            type="file"
                                            value={edit_cover_url}
                                            onChange={handleEditCoverUrl}
                                            multiline={2}
                                            autoComplete="off"
                                            label="Cover Url (only image)"
                                            helpText="Go to Content > click files > Upload image, copy the link and paste above"
                                        />
                                        {/* <DropZone onDrop={handleEditDropZoneDrop}>
                                            {editUploadedFiles}
                                            {editFileUpload}
                                        </DropZone>
                                        <div className="clear_container">
                                            <Stack.Item>
                                                <a className="imageClear">Clear</a>
                                                <Image
                                                    source={closeImage}
                                                    width="9px"
                                                    height="9px"
                                                />
                                            </Stack.Item>
                                        </div> */}
                                    </Stack>
                                </FormLayout.Group>
                            </FormLayout>
                        </Modal.Section>
                    </div>
                </Modal>
                {
                    delete_modal_active &&
                    <Modal
                        
                        open={true}
                        title="Delete Sample"
                        onClose={() => {
                        setDeleteModalActive(false);
                        }}
                        primaryAction={[
                        {
                            loading: deleting_sample,
                            content: 'Delete',
                            onAction: () => {
                            DeleteSample();
                            }
                        },
                        ]}
                        secondaryActions={[
                        {
                            content: 'Cancel',
                            onAction: () => {
                            setDeleteModalActive(false);
                            }
                        },
                        ]}
                    >
                        <Modal.Section>
                        Are you sure to Delete Sample ?
                        </Modal.Section>
                    </Modal>
                }
            </div>
        )
    }
    else{
        return (
            <div className='shephbeats-pack-page'>
                <Page fullWidth>
                    <Frame topBar={topBarMarkup} logo={logo}>
                        <Layout>
                            <Layout.Section>
                                <Card>
                                    <Card.Section>
                                        <div className="product-details-card">
                                            <MediaCard
                                                // description={
                                                //     <span className="downloads-sales" style={{display:"flex"}}>
                                                //         <span className="downloads">Downloads: <p className="downloads-k">5.55k</p></span>
                                                //         <p className="sales">Sales: <p className="sales-k">$15.45k</p></p>
                                                //     </span>
                                                // }
                                            >
                                                <VideoThumbnail
                                                    thumbnailUrl={edit_cover_url}
                                                />
                                                <div className="product-details">
                                                    <span className="product-title">{edit_title_name}</span>
                                                    <div className="genre-price-edit">
                                                        <span className="product-genre">{edit_genre}</span>
                                                        <span className="product-price">{"$ "+edit_price}</span>
                                                        <span className="product-edit" onClick={handleEditChange}>Edit Pack Details</span>
                                                    </div>
                                                    <div className="samples-left">
                                                        <span className="samples-text">*This pack can hold 250 samples, {samples_count} added and {250-samples_count} left</span>
                                                    </div>
                                                    <div className="product-description">
                                                        {edit_description}
                                                    </div>
                                                    <div className="add-delete-btns">
                                                        <ButtonGroup>
                                                            <Button primary onClick={handleAddSample}>+ Add Samples</Button>
                                                            <Button destructive onClick={deletePack}>Delete</Button>
                                                            <Button monochrome onClick={back}>Back</Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </div>
                                            </MediaCard>
                                            <p className="file-extension">png, jpg, svg, jpeg, webp</p>
                                        </div>
                                    </Card.Section>
                                        <Card.Section>
                                            <EmptyState
                                                heading="No Samples to show"
                                                action={{ 
                                                    content: "+ Add Samples",
                                                    onAction: () => {
                                                        handleAddSample();
                                                    }
                                                }}
                                                image={music_emptyState}
                                            >
                                            </EmptyState>
                                        </Card.Section>
                                </Card>
                            </Layout.Section>
                        </Layout>
                    </Frame>
                </Page>
                <Modal
                    open={!active} 
                    onClose={handleChange}
                    title="PACK DETAILS"
                    primaryAction={{
                        content: 'Save',
                        onAction: () => {
                            setCreatingProduct(true);
                            createProductAPI();
                        },
                    }}
                >
                    <div className="modal-class">
                        <Modal.Section>
                            <FormLayout>
                                <FormLayout.Group>
                                    <Stack vertical>
                                        <TextField
                                            label=""
                                            value={title_name}
                                            onChange={handleTitleName}
                                            placeholder="Pack Title"
                                        />
                                        {/* <Select
                                            label="Genre"
                                            labelHidden
                                            value={genre}
                                            onChange={handleGenre}
                                            options={[
                                                {
                                                    label: "Products",
                                                    value: "products"
                                                },
                                                {
                                                    label: "Variants",
                                                    value: "variants"
                                                }
                                            ]}
                                        /> */}
                                        <TextField
                                            type="number"
                                            label=""
                                            value={price}
                                            onChange={handlePrice}
                                            prefix="$"
                                            placeholder="Price"
                                            autoComplete="off"
                                        />
                                        <TextField
                                            value={description}
                                            onChange={handleDescription}
                                            multiline={4}
                                            autoComplete="off"
                                            placeholder="Descriptions"
                                        />
                                        <DropZone onDrop={handleDropZoneDrop}>
                                            {uploadedFiles}
                                            {fileUpload}
                                        </DropZone>
                                        <div className="clear_container">
                                            <Stack.Item>
                                                <a className="imageClear">Clear</a>
                                                <Image
                                                    source={closeImage}
                                                    width="9px"
                                                    height="9px"
                                                />
                                            </Stack.Item>
                                        </div>
                                    </Stack>
                                </FormLayout.Group>
                            </FormLayout>
                        </Modal.Section>
                    </div>
                </Modal>
            </div>
        )
    }
}

function DataProductsTable({rows, pack_id, searchType, type_selected, sort_selected, lowerTextFieldValue, upperTextFieldValue, searchValue, samples, callback, onUpdate, onDeleteClick}) {
    const navigate = useNavigate();
    const {replace} = useNavigationHistory();
    console.log("rows: ",rows);
    // console.log("lowerTextFieldValue: ",lowerTextFieldValue);
    // console.log("upperTextFieldValue: ",upperTextFieldValue);
    if (!rows.node || typeof rows.node !== "object") {
        rows.node = [];
    }
    if (rows.node) {
        rows = rows.filter(x => JSON.parse(x.node.metafields.edges[0].node.value).bpm >= lowerTextFieldValue && JSON.parse(x.node.metafields.edges[0].node.value).bpm <= upperTextFieldValue);
    }
    if (type_selected && type_selected.trim() !== "" && type_selected !== "all") {
        try {
            rows = rows.filter(x => JSON.parse(x.node.metafields.edges[0].node.value).type.match(new RegExp(type_selected, "gi")));
        } catch (e) {
            rows = rows;
        }
    }
    if (sort_selected !== "all") {
        switch (sort_selected) {
            case "title":
                try {
                    rows
                      function alphanumericSort(a, b) {
                        const aNumber = parseInt(a.node.title.replace(/[^\d]/g, ""));
                        const bNumber = parseInt(b.node.title.replace(/[^\d]/g, ""));
                        const aString = a.node.title.replace(/\d/g, "");
                        const bString = b.node.title.replace(/\d/g, "");
                        
                        if (aString < bString) {
                          return -1;
                        } else if (aString > bString) {
                          return 1;
                        } else {
                          return aNumber - bNumber;
                        }
                      }
                    rows =  rows.sort(alphanumericSort);
                } catch (e) {
                    rows = rows;
                }
                break;
            case "type":
                try {
                    rows
                      function alphanumericSort(a, b) {
                        const aNumber = parseInt(a._doc.title.replace(/[^\d]/g, ""));
                        const bNumber = parseInt(b._doc.title.replace(/[^\d]/g, ""));
                        const aString = a._doc.title.replace(/\d/g, "");
                        const bString = b._doc.title.replace(/\d/g, "");
                        
                        if (aString < bString) {
                          return -1;
                        } else if (aString > bString) {
                          return 1;
                        } else {
                          return aNumber - bNumber;
                        }
                      }
                    rows =  rows.sort(alphanumericSort);
                } catch (e) {
                    rows = rows;
                }
                break;
            case "price":
                try {
                    function alphanumericSort(a, b) {
                        const aNumber = parseInt(a.node.price.replace(/[^\d]/g, ""));
                        const bNumber = parseInt(b.node.price.replace(/[^\d]/g, ""));
                        const aString = a.node.price.replace(/\d/g, "");
                        const bString = b.node.price.replace(/\d/g, "");
                        if (aString < bString) {
                            return -1;
                        } else if (aString > bString) {
                            return 1;
                        } else {
                            return aNumber - bNumber;
                        }
                    }
                    rows =  rows.sort(alphanumericSort);
                } catch (e) {
                    rows = rows;
                }
                break;
            default:
                break;
        }
    }
    if (searchValue && searchValue.trim() !== "") {
        try {
            rows = rows.filter(x => x.node.title.match(new RegExp(searchValue, "gi")));
        } catch (e) {
            
        }
    }
    return (
      <DataTable
        rows={rows.map((row) => [
            <div className="sephbeats-thumbnail-title" style={{display: "flex"}}>
                { row.node && row.node && row.node.image && row.node.image.url  ? (
                    <Thumbnail
                        source={row.node.image.url}
                        size="small"
                        alt="Black choker necklace"
                    />
                ) : (
                    <Thumbnail
                        source={music1}
                        size="small"
                        alt="Black choker necklace"
                    />
                )}
                <span className="sephbeats-thumbnail-text">{row.node.title}</span>
            </div>,
            <div>
                <span>{"$"+row.node.price || 0}</span>
            </div>,
            <div>
                <span>{JSON.parse(row.node.metafields.edges[0].node.value).bpm || 0}</span>
            </div>,
            <div>
                <span>{JSON.parse(row.node.metafields.edges[0].node.value).type || 0}</span>
            </div>,
            <ButtonGroup segmented>
                <Badge status="success">Active</Badge>
            </ButtonGroup>,
            <ButtonGroup segmented>
                <Button
                icon={EditMajor}
                onClick={() => {
                    navigate('/pack/'+row.node.product.id.split("gid://shopify/Product/")[1]+"/sample/edit/"+row.node.id.split("gid://shopify/ProductVariant/")[1]);
                    replace({pathname: '/pack/'+row.node.product.id.split("gid://shopify/Product/")[1]+'/sample/edit/'+row.node.id.split("gid://shopify/ProductVariant/")[1]});
                }}
                />
                <Button
                icon={DeleteMajor}
                onClick={() => {
                    if (typeof onDeleteClick === "function") {
                    onDeleteClick(row);
                    }
                }}
                />
            </ButtonGroup>
        ])}
        columnContentTypes={[
          'text',
          'text',
          'text',
          'text',
          'text'
        ]}
        headings={[
          'Samples',
          'Price',
          'BPM',
          'type',
          'Status',
          'Action'
          
        ]}
      ></DataTable>
    );
}

const fake_products = [
    {
        "_id": "628266dc423a82ea3bb737b9",
        "store_id": 123,
        "product_id": 134124,
        "ab_testing": false,
        "active": true,
        "start_date": "2020-01-01T05:00:00.000Z",
        "product_name" : "zzzzzzz",
        "placement_type" : "zzzzzzz",
        "priority" : "5",
        "run_name": "first run",
        "upsell": {
            "views": 9,
            "matchings": [
                {
                    "product_id": 141414,
                    "clicks": 4
                },
                {
                    "product_id": 151515,
                    "clicks": 0
                }
            ]
        }
    },
    {
        "_id": "6282706c8ad9322c7a8e661a",
        "store_id": 123,
        "product_id": 134123,
        "ab_testing": true,
        "active": true,
        "product_name" : "zzzzzzz",
        "start_date": "2020-01-01T05:00:00.000Z",
        "placement_type" : "zzzzzzz",
        "priority" : "5",
        "run_name": "first run",
        "upsell": [
            {
                "views": 10,
                "matchings": [
                    {
                        "clicks": 0,
                        "product_id": 151515
                    },
                    {
                        "clicks": 1,
                        "product_id": 141414
                    }
                ]
            },
            {
                "views": 9,
                "matchings": [
                    {
                        "clicks": 2,
                        "product_id": 616161
                    },
                    {
                        "clicks": 0,
                        "product_id": 414141
                    },
                    {
                        "clicks": 0,
                        "product_id": 515151
                    }
                ]
            }
        ]
    }
    ];

const default_pagination = {
next_page: null,
prev_page: null,
total_records: 10
};