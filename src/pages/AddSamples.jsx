import { Layout, Popover, ActionList, TopBar, Frame, Grid, Badge, SkeletonBodyText, Heading, Tabs, ButtonGroup, MediaCard, VideoThumbnail, DataTable, Button, EmptyState, Card, Page, TextField, Icon, Stack, Avatar, Image, Modal, FormLayout, Select, Checkbox, DropZone, Thumbnail, TextStyle } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { useNavigationHistory, useToast } from "@shopify/app-bridge-react";
import { Axios } from  "../Axios";
import store from "store2";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { ChevronDownMinor, SearchMinor, NoteMinor, SearchMajor, DeleteMajor, AnalyticsMajor, EditMajor, FolderDownMajor, ArrowLeftMinor } from "@shopify/polaris-icons";
import { useNavigate, useParams } from "react-router";
import {
    announceIcon,
    logoImage,
    creditIcon,
    notification,
    closeImage
  } from '../assets';
  import music1 from "../assets/music1.jpeg";
  import logo1 from "../assets/logo.png";
  import music_emptyState from "../assets/music_emptyState.png";
  import { useDropzone } from "react-dropzone"
  

export default function AddSamples({ method }) {
    const { id } = useParams();
    const { sid } = useParams();
    const { show } = useToast();
    const {replace} = useNavigationHistory();
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(method === "edit" ? true : false);
    const [limit, setLimit] = useState(25);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const [active, setActive] = useState(true);
    const handleChange = useCallback(() => setActive(!active), [active]);

    const [edit_active, setEditActive] = useState(true);
    const handleEditChange = useCallback(() => setEditActive(!edit_active), [edit_active]);

    const [add_pack, setAddPack] = useState(true);
    const [edit_pack, setEditPack] = useState(true);
    const [add_sample, setAddSample] = useState(true);

    const handleAddSample = useCallback(() => setAddSample(!add_sample), [add_sample]);
    let [priceChecked, setPriceChecked] = useState(false);
    const [samples_count, setSamplesCount] = useState("0");
    const [searchValue, setSeachValue] = useState("");
    const searchInputOnChange = useCallback((searchValue) => setSeachValue(searchValue),[searchValue]);
    const [searchType, setSeachType] = useState("all");
    const searchTypeOnChange = useCallback((searchType) => setSeachType(searchType),[searchType]);

    const [files, setFiles] = useState([]);
    const [creating_product, setCreatingProduct] = useState(false);

    const [price, setPrice] = useState("50");
    const [description, setDescription] = useState("");
    const [title_name, setTitleName] = useState("");
    const [genre, setGenre] = useState("");

    const [bpm, setBpm] = useState("1");
    const [type, setType] = useState("");

    const [edit_price, setEditPrice] = useState('50');
    const [edit_description, setEditDescription] = useState("");
    const [edit_title_name, setEditTitleName] = useState("");
    const [edit_genre, setEditGenre] = useState("");

    const handleDescription = useCallback((description) => {setDescription(description)},[description]);
    const handleTitleName = useCallback((title_name) => {setTitleName(title_name)},[title_name]);
    const handleGenre = useCallback((genre) => {setGenre(genre)},[genre]);
    const handlePrice = useCallback((price) => {setPrice(price)},[price]);

    const handleBpm = useCallback((bpm) => {setBpm(bpm)},[bpm]);
    const handleType = useCallback((type) => {setType(type)},[type]);

    const [isSearchActive, setIsSearchActive] = useState(false);
    const [selected, setSelected] = useState(0);

    const [popoverActive, setPopoverActive] = useState(false);
    const [creating_samples, setCreatingSamples] = useState(false);
    const [pack_id, setPackId] = useState(id || "");
    const [cover_url, setCoverUrl] = useState("");
    const [edit_cover_url, setEditCoverUrl] = useState("");

    const handleCoverUrl = useCallback((cover_url) => {
        setCoverUrl(cover_url);
        disableContinueButton();
    }, []);
    const handleEditCoverUrl = useCallback((edit_cover_url) => {
        setEditCoverUrl(edit_cover_url);
    }, []);

    useEffect(() => {
        // console.log("product_id: ", id);
        try {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (e) {}
        if (method === "edit") {
            console.log("edit", sid);
            console.log("id", id);
            Axios(
                {
                    type: "get",
                    url: "/merchant/edit_sample?id=" + sid+"&product_id="+id+"&shop="+store("shop"),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                function (error, variant) {
                    if (variant) {
                        console.log("data: ", variant);
                        setTitleName(variant.title);
                        setPrice(variant.price);
                        setType(JSON.parse(variant.metafields.edges[0].node.value).type);
                        setBpm(JSON.parse(variant.metafields.edges[0].node.value).bpm);
                        // setPackId(variant.product_id);
                        setCoverUrl(JSON.parse(variant.metafields.edges[0].node.value).cover_url);
                        // setSamplesCount(data.samples_count);
                    } else {
                        console.error(error);
                    }
                    setLoading(false);
                }
            );

            Axios(
                {
                    type: "get",
                    url: "/merchant/count_sample?product_id="+id,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                function (error, data) {
                    console.log("data: ",data);
                    if (data) {

                        setSamplesCount(data.samples_count);
                    } else {
                        console.error(error);
                    }
                    setLoading(false);
                }
            );
        }
        else{
            Axios(
                {
                    type: "get",
                    url: "/merchant/count_sample?product_id="+id,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                function (error, data) {
                    console.log("data: ",data);
                    if (data) {

                        setSamplesCount(data.samples_count);
                    } else {
                        console.error(error);
                    }
                    setLoading(false);
                }
            );
        }
      }, []);

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

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

    const handleSearchResultsDismiss = useCallback(() => {
        setIsSearchActive(false);
        setSearchValue('');
    }, []);

    const handleSearchChange = useCallback((value) => {
        setSearchValue(value);
        setIsSearchActive(value.length > 0);
    }, []);

    const handleNavigationToggle = useCallback(() => {
        console.log('toggle navigation visibility');
    }, []);



    const [myFiles, setMyFiles] = useState([])

  const onDrop = useCallback(acceptedFiles => {
    setMyFiles([...myFiles, ...acceptedFiles])
  }, [myFiles])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  })

  const removeFile = file => () => {
    const newFiles = [...myFiles]
    newFiles.splice(newFiles.indexOf(file), 1)
    setMyFiles(newFiles)
  }

  const removeAll = () => {
    setMyFiles([])
  }

  const validImageTypes = ['file/mp3'];
    // const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !files.length && (
        <DropZone.FileUpload actionHint="Accept audios" />
    );
    const uploadedFiles = files.length > 0 && (
        <div style={{marginTop: '10px'}}>
            <Card>
                <Card.Section>
                    <Stack>
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
                            {/* {file.name}{' '} */}
                            {/* <TextStyle ext variant="bodySm" as="p">
                                {file.size} bytes
                            </TextStyle> */}
                            </div>
                        </Stack>
                        ))}
                    </Stack>
                </Card.Section>
            </Card>
        </div>
    );

  const dropFiles = myFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes{" "}
      <button onClick={removeFile(file)}>Remove File</button>
      <Stack alignment="center">
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
                            {/* {file.name}{' '} */}
                            {/* <TextStyle ext variant="bodySm" as="p">
                                {file.size} bytes
                            </TextStyle> */}
                            </div>
                        </Stack>
    </li>
  ))

    const logo = {
        width: 124,
        topBarSource:
        logo1,
        url: '#',
        accessibilityLabel: 'shephbeats',
    };

    

    const handleDropZoneDrop = useCallback( 
        (_droppedFiles, acceptedFiles, rejectedFiles) => {
            // setFiles((files) => [...files, ...acceptedFiles])
            console.log('Accepted Files' + acceptedFiles[0]);
            console.log('Rejected Files' + rejectedFiles[0]);
            setFiles(acceptedFiles);
        },
        []
    );

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
    
        const searchFieldMarkup = (
            <TopBar.SearchField
            onChange={handleSearchChange}
            value={searchValue}
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
                    <Button
                                onClick={() => { 
                            navigate("/home");
                            replace({pathname: '/home'});
                        }}
                    >Back
                    </Button>
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
          onSearchResultsDismiss={handleSearchResultsDismiss}
          onNavigationToggle={handleNavigationToggle}
        />
      );

    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );

    function disableContinueButton() {
        var disabled = false;
        if (!title_name || title_name.trim() === "" || title_name.length < 2)
            disabled = true;
        if (!cover_url || cover_url.trim() === "" || cover_url.length < 2)
            disabled = true;

        var file_url = cover_url;
        function getExtension(filename) {
            return filename.split(".").pop().split("?v=")[0];
        }
        let extension = getExtension(file_url);
        if(extension == "mp3"){
            console.log(extension);
            disabled = false;
        }
        else{
            disabled = true;
        }
        return disabled;
    }

    function saveSamplesAPI() {
        console.log("saveSamplesAPI");
        if (method === "edit") {
            console.log("update");
            setLoading(true);
            const fd = new FormData();
            if (files) {
                console.log("files:", files[0]);
                fd.append('audio', files[0]);
            }

            fd.append('title', title_name);
            fd.append('shop', store("shop"));
            fd.append('pack_id', id);
            fd.append('price', price);
            fd.append('sample_id', sid);
            fd.append('type', type);
            fd.append('bpm', bpm);
            console.log("fd: ", ...fd);

            // var update_sample = {
            //     shop: store("shop"),
            //     title: title_name,
            //     pack_id: id,
            //     sample_id: sid,
            //     cover_url: cover_url,
            //     price: price,
            //     type: type,
            //     bpm: bpm
            // };
            // console.log(update_sample);
            Axios(
                {
                    type: "put",
                    url: "/merchant/update_sample",
                    // data: JSON.stringify(update_sample),
                    data: fd
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // },
                },
                function (error, success) {
                    if (error) {
                        setCreatingSamples(false);
                    } else {
                        setCreatingSamples(false);
                        setActive(true);
                        show("Samples updated Successfully");
                        navigate("/pack-page/"+id);
                        replace({pathname: '/pack-page/'+id});
                        setLoading(false);
                    }
                }
            );
        } else {
            console.log("create api called.", title_name);
            setLoading(true);
            const fd = new FormData();
            if (files) {
                console.log("files:", files[0]);
                fd.append('audio', files[0]);
            }

            fd.append('title', title_name);
            fd.append('shop', store("shop"));
            fd.append('pack_id', id);
            fd.append('price', price);
            fd.append('type', type);
            fd.append('bpm', bpm);
            console.log("fd: ", ...fd);
            // var add_sample = {
            //     shop: store("shop"),
            //     title: title_name,
            //     pack_id: id,
            //     cover_url: cover_url,
            //     price: price,
            //     type: type,
            //     bpm: bpm
            // };
            Axios(
                {
                    type: "post",
                    url: "/merchant/add_samples",
                    // data: JSON.stringify(add_sample),
                    // headers: {
                    //     'Content-Type': 'multipart/form-data'
                    // },
                    data: fd,
                },
                function (error, success) {
                    if (error) {
                        setCreatingSamples(false);
                    } else {
                        console.log("success",success);
                        if (success) {
                            setCreatingSamples(false);
                            setActive(true);
                            show("Samples added Successfully");
                            navigate("/pack-page/"+id); 
                            replace({pathname: '/pack-page/'+id});
                            setLoading(false);
                        }
                    }
                }
            );
        }
    }

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

    return (
        <div className='shephbeats-pack-page'>
            <Page fullWidth>
                <Frame topBar={topBarMarkup} logo={logo}>
                    <Layout>
                        <Layout.Section>
                            <Card>
                                <Card.Section>
                                    <Grid>
                                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 3, xl: 3}}>
                                            
                                        </Grid.Cell>
                                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                                            <FormLayout>
                                                <FormLayout.Group>
                                                        <Stack vertical>
                                                            <TextField
                                                                label="Sample Title"
                                                                value={title_name}
                                                                onChange={handleTitleName}
                                                            />
                                                            <TextField
                                                                type="number"
                                                                label="Price"
                                                                value={price}
                                                                onChange={handlePrice}
                                                                prefix="$"
                                                                autoComplete="off"
                                                            />
                                                            <TextField
                                                                type="text"
                                                                label="Type"
                                                                value={type}
                                                                onChange={handleType}
                                                                autoComplete="off"
                                                            />
                                                            <TextField
                                                                type="number"
                                                                label="BPM"
                                                                value={bpm}
                                                                onChange={handleBpm}
                                                                autoComplete="off"
                                                                min={1}
                                                                max={200}
                                                            />
                                                            {/* <TextField
                                                                type="file"
                                                                value={cover_url}
                                                                onChange={handleCoverUrl}
                                                                multiline={3}
                                                                autoComplete="off"
                                                                label="Audio URL"
                                                                helpText="Go to Content > click files > Upload audio, copy the link and paste above"
                                                            /> */}
                                                            <DropZone
                                                                type="file"
                                                                accept="audio/*"
                                                                onDrop={handleDropZoneDrop}
                                                                allowMultiple={false}
                                                                styles={{
                                                                    dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
                                                                    inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
                                                                  }}
                                                            >
                                                            <DropZone.FileUpload actionHint="Accepts audios" />
                                                            </DropZone>
                                                            {uploadedFiles}
                                                            <p style={{marginTop: "20px", textAlign: "center"}}>*This pack can hold 250 samples, {samples_count} added and {250-samples_count} left</p>
                                                            <div style={{textAlign: "center", marginTop: "20px"}}>
                                                                <Button 
                                                                    primary
                                                                    // disabled={disableContinueButton()}
                                                                    onClick={() => {saveSamplesAPI()}}
                                                                    loading={creating_samples}
                                                                >Continue</Button>
                                                            </div>
                                                        </Stack>
                                                </FormLayout.Group>
                                            </FormLayout>
                                        </Grid.Cell>
                                        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 3, xl: 3}}>
                                        {/* <section className="container">
                                        <div {...getRootProps({ className: "dropzone" })}>
                                            <input {...getInputProps()} />
                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                        </div>
                                        <aside>
                                            <h4>Files</h4>
                                            <ul>{dropFiles}</ul>
                                        </aside>
                                        {files.length > 0 && <button onClick={removeAll}>Remove All</button>}
                                        </section> */}
                                        </Grid.Cell>
                                    </Grid>
                                </Card.Section>
                            </Card>
                        </Layout.Section>
                        <Layout.Section></Layout.Section>
                    </Layout>
                </Frame>
            </Page>
        </div>
    );
}