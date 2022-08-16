<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
    crossorigin=""></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@0.4.1/dist/leaflet.draw.css" />
    <script src="https://unpkg.com/leaflet-draw@0.4.1/dist/leaflet.draw.js"></script>
</svelte:head>
<script>
// @ts-nocheck

    import {
        Button,
        Header,
        HeaderUtilities,
        HeaderAction,
        HeaderPanelLinks,
        HeaderPanelDivider,
        HeaderPanelLink,
        SkipToContent,
        ComboBox,
        Modal,
        OverflowMenu, 
        OverflowMenuItem,
        Popover,
        DatePicker,
        DatePickerInput,
        TileGroup,
        RadioTile,
        TextInput,
        Accordion,
        AccordionItem,
        FileUploader,
        FileUploaderDropContainer,
        ButtonSet,
        FileUploaderItem,
        DataTable,
        Toolbar,
        ToolbarContent,
        ToolbarSearch,
        ToolbarMenu,
        ToolbarMenuItem,
        SelectItem,
        FluidForm,
        Form,
        Tab,
        Tabs,
        TabContent,
        Search,
        Slider,
        MultiSelect,
        Link,
        Pagination,
    } from "carbon-components-svelte";
    import { Upload, View, TreeView, Area, AreaCustom, WatsonHealthCircleMeasurement, ChartNetwork, Reset, CheckboxChecked, OrderDetails, Launch, Settings, Number_0, JoinRight, Label } from "carbon-icons-svelte";
    import Drawer from 'svelte-drawer-component';
    import MapBoundary from "carbon-icons-svelte/lib/MapBoundary.svelte";
    import SettingsAdjust from "carbon-icons-svelte/lib/SettingsAdjust.svelte";
    import UserAvatarFilledAlt from "carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte";
    import "carbon-components/css/carbon-components.min.css";
    import { BarChartGrouped, BarChartSimple, DonutChart } from "@carbon/charts-svelte";
    import "@carbon/charts/styles.min.css";
    import { onMount } from 'svelte';
    import { browser } from '$app/env';
    import * as defaults from "../lib/model/defaults";
    import * as mainUi from "../lib/controller/mainUi";
    import * as maps from "../../src/lib/view/maps";
    import * as colors from "../../src/lib/view/colors";
    import * as chart from "../../src/lib/view/chartData";
    import * as client from "../../src/lib/controller/geoapiClient";
    import Bignumber from "$lib/view/bignumber.svelte";

    let isSideNavOpen = false;
    let moduleName = "Usecase 10 - Blacksite v1.1";
    let shouldFilterItem = mainUi.shouldFilterItem;
    let boundaries;
    let boundaryId = '';
    let mapPage=1;
    let siteNames;
    let drawOptions;
    let simulationResult;
    let simulationStat = {
        count: {value: 'N/A', change: 'N/A'},
        min: {value: 'N/A', change: 'N/A'},
        max: {value: 'N/A', change: 'N/A'},
        catExcellent: {value: 'N/A', change: 'N/A'},
        catGood: {value: 'N/A', change: 'N/A'},
        catFair: {value: 'N/A', change: 'N/A'},
        catPoor: {value: 'N/A', change: 'N/A'},
        deltaUpgraded: {value: 'N/A', change: 'N/A'},
        deltaDegraded: {value: 'N/A', change: 'N/A'},
        deltaUnchanged: {value: 'N/A', change: 'N/A'},
        statusSafe: {value: 'N/A', change: 'N/A'},
        statusUnsafe: {value: 'N/A', change: 'N/A'},
        statusFatal: {value: 'N/A', change: 'N/A'},
    };
    let chartsData = {
        donut: {
            tilesKpi: [],
            delta: [],
            status: [],
        },
        barGroup: {
            compareKpi: [],
            distribution: [],
        },
        bar: {
            distributionOriginal: [],
            distributionSimulation: [],
            colors: {},
        },
    }

    function onSimulationCompleted(data) {
        siteNames = data.siteNames;
        drawOptions = {
            dismantledSite: '',
            allSites: data.simulationResult['sites'],
            allTiles: data.simulationResult['tiles'],
            boundaryData: data.boundaryData,
            simData: data.simulationResult['original'],
            oriData: data.simulationResult['original'],
        }
        simulationResult = data.simulationResult;
    }

    function computeStatistics(data0, data1) {
        let result = {
            'count': {
                'value': data1.count,
                'change': data1.count - data0.count > 0 ? 'up': data1.count - data0.count == 0 ? 'none': 'down',
            },
            'min': {
                'value': data1.min,
                'change': data1.min - data0.min > 0 ? 'up': data1.min - data0.min == 0 ? 'none': 'down',
            },
            'max': {
                'value': data1.max,
                'change': data1.max - data0.max > 0 ? 'up': data1.max - data0.max == 0 ? 'none': 'down',
            },
            'catExcellent': {
                'value': data1.category.Excellent,
                'change': data1.category.Excellent - data0.category.Excellent > 0 ? 
                    'up': data1.category.Excellent - data0.category.Excellent == 0 ? 'none': 'down',
            },
            'catGood': {
                'value': data1.category.Good,
                'change': data1.category.Good - data0.category.Good > 0 ? 
                    'up': data1.category.Good - data0.category.Good == 0 ? 'none': 'down',
            },
            'catFair': {
                'value': data1.category.Fair,
                'change': data1.category.Fair - data0.category.Fair > 0 ? 
                    'up': data1.category.Fair - data0.category.Fair == 0 ? 'none': 'down',
            },
            'catPoor': {
                'value': data1.category.Poor,
                'change': data1.category.Poor - data0.category.Poor > 0 ? 
                    'up': data1.category.Poor - data0.category.Poor == 0 ? 'none': 'down',
            },
            'deltaUpgraded': {
                'value': data1.deltaSummary ? data1.deltaSummary.UPGRADED: 'N/A',
                'change': 'none',
            },
            'deltaUnchanged': {
                'value': data1.deltaSummary ? data1.deltaSummary.UNCHANGE: 'N/A',
                'change': 'none',
            },
            'deltaDegraded': {
                'value': data1.deltaSummary ? data1.deltaSummary.DEGRADED: 'N/A',
                'change': 'none',
            },
            'statusSafe': {
                'value': data1.deltaSummary ? data1.statusSummary.SAFE: 'N/A',
                'change': 'none',
            },
            'statusUnsafe': {
                'value': data1.deltaSummary ? data1.statusSummary.UNSAFE: 'N/A',
                'change': 'none',
            },
            'statusFatal': {
                'value': data1.deltaSummary ? data1.statusSummary.FATAL: 'N/A',
                'change': 'none',
            },
        }
        simulationStat = result;
        return result;
    }

    function setupDistributionData(data) {
        let result = [];
        data.frequency.forEach(e => {
            result.push({"group": e[0], "value": e[1]});
        });
        return result;
    }

    function setupDistributionColor(data) {
        let result = {};
        data.frequency.forEach(e => {
            let key = e[0];
            let value = colors.fromValue(key);
            result[key.toString()] = value;
        });
        console.log(result);
        return result;
    }

    function setupChartsData(data0, data1) {
        chartsData = {
            donut: {
                tilesKpi: [
                    {"group": "Excellent", "value": data1.category.Excellent},
                    {"group": "Good", "value": data1.category.Good},
                    {"group": "Fair", "value": data1.category.Fair},
                    {"group": "Poor", "value": data1.category.Poor},
                ],
                delta: [
                    {"group": "Upgrade", "value": data1.deltaSummary ? data1.deltaSummary.UPGRADED: 0},
                    {"group": "Unchange", "value": data1.deltaSummary ? data1.deltaSummary.UNCHANGE: 0},
                    {"group": "Degrade", "value": data1.deltaSummary ? data1.deltaSummary.DEGRADED: 0},
                ],
                status: [
                    {"group": "Safe", "value": data1.deltaSummary ? data1.statusSummary.SAFE: 0},
                    {"group": "Unsafe", "value": data1.deltaSummary ? data1.statusSummary.UNSAFE: 0},
                    {"group": "Fatal", "value": data1.deltaSummary ? data1.statusSummary.FATAL: 0},
                ],
            },
            barGroup: {
                compareKpi: [
                    {"group":"After", "key": "Excellent", "value": data1.category.Excellent},
                    {"group":"After", "key": "Good", "value": data1.category.Good},
                    {"group":"After", "key": "Fair", "value": data1.category.Fair},
                    {"group":"After", "key": "Poor", "value": data1.category.Poor},
                    {"group":"Before", "key": "Excellent", "value": data0.category.Excellent},
                    {"group":"Before", "key": "Good", "value": data0.category.Good},
                    {"group":"Before", "key": "Fair", "value": data0.category.Fair},
                    {"group":"Before", "key": "Poor", "value": data0.category.Poor},
                ],
            },
            bar: {
                distributionOriginal: setupDistributionData(data0),
                distributionSimulation: setupDistributionData(data1),
                colors: setupDistributionColor(data1),
            },
        }
        //console.log(chartsData.bar.colors)
    }

    onMount(async () => {
        // get boundaries
        boundaries = await client.fetchBoundaries();

        let mainMapTilesActual = L.layerGroup();
        let mainMapTilesSimulation = L.layerGroup();
        // getBoundaries()
        if(browser) {
            maps.setupMap(maps.mainMap);
            // setupMap(addMap);
            // setupMap(editMap);
            // setupMap(deleteMap);
            maps.setupMap(maps.beforeMap);
            maps.setupMap(maps.afterMap);
            // maps.setupMap(maps.deltaMap);
        }
        mapPage=0;
    });
</script>
  
<Header company="Telkomsel" platformName={moduleName} bind:isSideNavOpen>
    <svelte:fragment slot="skip-to-content">
        <SkipToContent />
    </svelte:fragment>
    <HeaderUtilities>
        <!-- <HeaderAction
            text="Administrator"
            bind:isOpen={isOpen1}
            icon={UserAvatarFilledAlt}
            closeIcon={UserAvatarFilledAlt}
        >
            <HeaderPanelLinks>
                <HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
                <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
                <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
                <HeaderPanelDivider>Switcher subject 3</HeaderPanelDivider>
                <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
            </HeaderPanelLinks>
        </HeaderAction> -->
    </HeaderUtilities>
</Header>
<div class="container col start" style="width:100vw; height:calc(100vh - 50px); margin-top:50px; background-color:#fafafa;">
    <!-- Toolbar and other non workflow functions -->
    <!-- <div class="control row border-bottom" style="width:100%; height:60px"></div> -->
    <div class="container row start" style="width:100vw; height:100%; background-color:transparent;">
        <!-- Requirement panel -->
        <div class="container col start border-right" style="width:calc(33% - 1px); height:100%; background-color:#fff;">
            <div class="container col" style="width:calc(100%); height:110px; padding: 14px;">
                <!-- date & regional panel -->
                <div class="container row space-between" style="width:calc(100%); height:40px;">
                    <div style="width:50%">
                        <DatePicker datePickerType="single" on:change>
                            <DatePickerInput size="sm" placeholder="mm/dd/yyyy" />
                        </DatePicker>
                    </div>
                    <div style="width:50%">
                        <ComboBox
                            size="sm"
                            placeholder="Select regional"
                            items={defaults.regionals}
                            on:select={(e) => {
                                //storeRegionalsSelected.set(e.detail.selectedItem)
                                // getSites()
                            }}
                            on:clear={(e) => {
                                //storeRegionalsSelected.set({})
                                //storeSites.set([]);
                            }}
                        />
                    </div>
                </div>
                <!-- external boundary source panel -->
                <div class="container row space-between" style="width:calc(100%); align-items: center; height:40px;">
                    <div style="width:calc(50% - 5px)">
                        <ComboBox
                            size="sm"
                            placeholder="Select from registered boundary"
                            items={boundaries}
                            on:select={async (e) => {
                                boundaryId = e.detail.selectedItem.text;
                                let params = {
                                    date: '20220520',
                                    region: '01',
                                    boundaryId: boundaryId,
                                }
                                await client.performSimulation(params, onSimulationCompleted);
                                drawOptions.mapObj = maps.mainMap;
                                maps.drawSimulationCategory(drawOptions);
                                drawOptions.simData = simulationResult["original"];
                                computeStatistics(simulationResult["original"], drawOptions.simData);
                                setupChartsData(simulationResult["original"], drawOptions.simData);
                            }}
                            on:clear={(e) => {
                                maps.clearMap(maps.mainMap);
                                computeStatistics({}, {});
                                setupChartsData({}, {});
                            }}
                        />
                    </div>
                    <div> - or - </div>
                    <Button size="sm" kind="tertiary">Load from File</Button>
                </div>
            </div>
            <!-- map panel -->
            <div class="container row start" style="width:100%; height:680px;">
                <div id="main-map" style="width:{maps.mainMap.width}px; height:{maps.mainMap.height}px;"></div>
            </div>
            <!-- legend panel -->
            <div class="container row space-between" style="width:calc(100% - 28px); height:60px; align-items: center; margin: 0 14px;">
                <div>Legend</div>
            </div>
        </div>
    
        <!-- Fine tune panel -->
        <div class="container col start" style="width:calc(67% - 12px); height:100%; background-color:#fafafa; overflow-y:clip;">
            <Tabs 
                bind:selected={mapPage}
                on:change={(e) => {
                    console.log(mapPage + "; " + boundaryId);
                    if (boundaryId != '') {
                        if (mapPage == 0 || mapPage == 2) {
                            maps.drawSimulationCategory(drawOptions);
                        } else if (mapPage == 1) {
                            maps.drawOnMultimap(drawOptions);
                        }
                    }
                }}
            >
                <Tab label="Dashboard" />
                <Tab label="Multimap" />
                <Tab label="Tables" />
                <svelte:fragment slot="content">
                    <TabContent>
                        <div class="container col" style="width:calc(100%); height:100%; padding: 14px;">
                            <div class="container row start" style="width:100%;">
                                <div style="width:25%; padding-bottom:14px;">
                                    <ComboBox
                                        size="sm"
                                        placeholder="Select site to simulate dismantle"
                                        items={siteNames}
                                        on:select={(e) => {
                                            drawOptions.dismantledSite = e.detail.selectedId;
                                            if (e.detail.selectedId != '') {
                                                drawOptions.simData = simulationResult["simulation"][e.detail.selectedId];
                                            } else {
                                                drawOptions.simData = simulationResult["original"];
                                            }
                                            maps.drawSimulationCategory(drawOptions);
                                            computeStatistics(simulationResult["original"], drawOptions.simData);
                                            setupChartsData(simulationResult["original"], drawOptions.simData);
                                        }}
                                        on:clear={(e) => {
                                            drawOptions.dismantledSite = '';
                                            drawOptions.simData = simulationResult["original"];
                                            maps.drawSimulationCategory(drawOptions);
                                            computeStatistics(simulationResult["original"], drawOptions.simData);
                                            setupChartsData(simulationResult["original"], drawOptions.simData);
                                        }}
                                    />
                                </div>
                            </div>
                            <div class="container col start" style="width:100%; height:calc(100% - 60px);">
                                <div style="display:flex; flex-flow:row nowrap; width:100%;">
                                    <Bignumber 
                                        field="tiles" 
                                        value={simulationStat.count.value} 
                                        color="gray" 
                                        direction={simulationStat.count.change}
                                        width="calc((100% - 40px)/5)"/>
                                    <Bignumber 
                                        field="Excellent" 
                                        value={simulationStat.catExcellent.value} 
                                        color={colors.byCategory("Excellent")} 
                                        direction={simulationStat.catExcellent.change}
                                        width="calc((100% - 40px)/5)"/>
                                    <Bignumber 
                                        field="Good" 
                                        value={simulationStat.catGood.value} 
                                        color={colors.byCategory("Good")} 
                                        direction={simulationStat.catGood.change}
                                        width="calc((100% - 40px)/5)"/>
                                    <Bignumber 
                                        field="Fair" 
                                        value={simulationStat.catFair.value} 
                                        color={colors.byCategory("Fair")} 
                                        direction={simulationStat.catFair.change}
                                        width="calc((100% - 40px)/5)"/>
                                    <Bignumber 
                                        field="Poor" 
                                        value={simulationStat.catPoor.value} 
                                        color={colors.byCategory("Poor")} 
                                        direction={simulationStat.catPoor.change}
                                        rightMost 
                                        width="calc((100% - 40px)/5)"/>
                                </div>
            
                                <div class="container row start" style="width:100%; height:380px; background-color:#fff; margin:12px 0; border:1px solid #eee;">
                                    <div class="container col start" style="width:400px; padding:12px;">
                                        <DonutChart 
                                            data={chartsData.donut.tilesKpi}
                                            options={{
                                                "data": {
                                                },
                                                "resizable": true,
                                                "donut": {
                                                    "center": {
                                                        "label": "Tiles"
                                                    },
                                                    "alignment": "center",
                                                },
                                                "legend": {
                                                    "alignment": "center",
                                                },
                                                "color": {
                                                    "scale": {
                                                        "Excellent": colors.c1,
                                                        "Good": colors.c2,
                                                        "Fair": colors.c3,
                                                        "Poor": colors.c4
                                                    }
                                                },
                                                "toolbar":{
                                                    "enabled": false,
                                                },
                                                "height": "335px",
                                                "data": {
                                                    "loading": chartsData.donut.tilesKpi.length == 0,
                                                },
                                            }}
                                        />
                                    </div>
                                    <div class="container col start" style="width:300px; padding:12px;">
                                        <BarChartGrouped
                                            data={chartsData.barGroup.compareKpi}
                                                options={{
                                                    "axes": {
                                                        "bottom": {
                                                            "mapsTo": "value"
                                                        },
                                                        "left": {
                                                            "scaleType": "labels",
                                                            "mapsTo": "key"
                                                        }
                                                    },
                                                    "bars": {
                                                        "width": 40,
                                                    },
                                                    "height": "335px",
                                                    "color": {
                                                        "scale": {
                                                            "Before": colors.c1,
                                                            "After": colors.c2,
                                                        }
                                                    },
                                                    "toolbar":{
                                                        "enabled": false,
                                                    },
                                                    "data": {
                                                        "loading": chartsData.barGroup.compareKpi == 0,
                                                    },
                                                }}
                                            />
                                    </div>
                                    <div class="container col start" style="width:calc(100% - 700px); border-right:1px solid #eee; padding:12px;">
                                        <BarChartSimple
                                            data={chartsData.bar.distributionSimulation}
                                                options={{
                                                    "axes": {
                                                        "left": {
                                                            "mapsTo": "value"
                                                        },
                                                        "bottom": {
                                                            "scaleType": "linear",
                                                            "mapsTo": "group",
                                                            "includeZero": false,
                                                        }
                                                    },
                                                    "legend": {
                                                        "enabled": false,
                                                    },
                                                    "height": "335px",
                                                    "getFillColor": function(group) {
                                                        return colors.fromValue(group);
                                                    },
                                                    "toolbar":{
                                                        "enabled": false,
                                                    },
                                                    "data": {
                                                        "loading": chartsData.bar.distributionSimulation == 0,
                                                    },
                                                }}
                                            />
                                    </div>
                                </div>
            
                                <div class="container row start" style="width:100%; height:300px;">
                                    <div class="container row start" style="width:calc(50% - 6px); height:282px; margin-right:12px">
                                        <div style="display:flex; flex-flow:column nowrap; width:200px; margin-right:12px;">
                                            <Bignumber 
                                                field="upgraded" 
                                                value={simulationStat.deltaUpgraded.value} 
                                                color={colors.byDelta('Upgrade')}
                                                direction={simulationStat.deltaUpgraded.change}
                                                width="200px"/>
                                            <div style="height:12px"/>
                                            <Bignumber 
                                                field="unchanged" 
                                                value={simulationStat.deltaUnchanged.value} 
                                                color={colors.byDelta('Unchange')}
                                                direction={simulationStat.deltaUnchanged.change}
                                                width="200px"/>
                                            <div style="height:12px"/>
                                            <Bignumber 
                                                field="degraded" 
                                                value={simulationStat.deltaDegraded.value} 
                                                color={colors.byDelta('Degrade')}
                                                direction={simulationStat.deltaDegraded.change}
                                                width="200px"/>
                                        </div>
                                        <div style="width:calc(100% - 212px); padding:5px 0; background-color:#fff; border:1px solid #eee;">
                                            <DonutChart 
                                                data={chartsData.donut.delta}
                                                options={{
                                                    "data": {
                                                    },
                                                    "resizable": true,
                                                    "donut": {
                                                        "center": {
                                                            "label": "Tiles"
                                                        },
                                                        "alignment": "center",
                                                    },
                                                    "legend": {
                                                        "alignment": "center",
                                                    },
                                                    "color": {
                                                        "scale": {
                                                            "Upgrade": colors.c2,
                                                            "Unchange": colors.c3,
                                                            "Degrade": colors.c4,
                                                        }
                                                    },
                                                    "toolbar":{
                                                        "enabled": false,
                                                    },
                                                    "height": "250px",
                                                    "data": {
                                                        "loading": chartsData.donut.delta.length == 0,
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div class="container row start" style="width:calc(50% - 6px); height:282px;">
                                        <div style="display:flex; flex-flow:column nowrap; width:200px; margin-right:12px;">
                                            <Bignumber 
                                                field="safe" 
                                                value={simulationStat.statusSafe.value} 
                                                color={colors.byStatus('Safe')}
                                                direction={simulationStat.statusSafe.change}
                                                width="200px"/>
                                            <div style="height:12px"/>
                                            <Bignumber 
                                                field="unsafe" 
                                                value={simulationStat.statusUnsafe.value} 
                                                color={colors.byStatus('Unsafe')}
                                                direction={simulationStat.statusUnsafe.change}
                                                width="200px"/>
                                            <div style="height:12px"/>
                                            <Bignumber 
                                                field="fatal" 
                                                value={simulationStat.statusFatal.value} 
                                                color={colors.byStatus('Fatal')}
                                                direction={simulationStat.statusFatal.change}
                                                width="200px"/>
                                        </div>
                                        <div style="width:calc(100% - 212px); padding:5px 0; background-color:#fff; border:1px solid #eee;">
                                            <DonutChart 
                                                data={chartsData.donut.status}
                                                options={{
                                                    "data": {
                                                    },
                                                    "resizable": true,
                                                    "donut": {
                                                        "center": {
                                                            "label": "Tiles"
                                                        },
                                                        "alignment": "center",
                                                    },
                                                    "legend": {
                                                        "alignment": "center",
                                                    },
                                                    "color": {
                                                        "scale": {
                                                            "Safe": colors.c2,
                                                            "Unsafe": colors.c4,
                                                            "Fatal": "black",
                                                        }
                                                    },
                                                    "toolbar":{
                                                        "enabled": false,
                                                    },
                                                    "height": "250px",
                                                    "data": {
                                                        "loading": chartsData.donut.status.length == 0,
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabContent>
                    <TabContent>
                        <div class="container col start">
                            <div class="container row start" style="width:100%; height:54px; background-color:white;"></div>
                            <div class="container row start" style="width:100%; height:calc(100% - 50px); background-color:white;">
                                <div id="before-map" style="width:calc(50% - 6px); height:676px; margin-right:12px;"></div>
                                <div id="after-map" style="width:calc(50% - 6px); height:676px;"></div>
                            </div>
                        </div>
                    </TabContent>
                    <TabContent>Content 3</TabContent>
                </svelte:fragment>
            </Tabs>
        </div>
    </div>
</div>

<style>
    @import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';

    :global(.bx--list-box__menu-item, .bx--list-box__menu-item__option) {
        height: auto;
    }

    .app-drawer :global(.drawer .overlay) {
        background: rgba(100, 100, 100, 0.5);
    }

    .app-drawer :global(.drawer .panel) {
        color: white;
        z-index: 99999;
    }

    .container {
        display: flex;
        flex-wrap: nowrap;
    }

    .row {
        flex-direction: row;
    }

    .col {
        flex-direction: column;
    }

    .wrap {
        flex-wrap: wrap;
    }

    .start {
        justify-content: flex-start;
    }

    .end {
        justify-content: flex-end;
    }

    .center {
        justify-content: center;
    }

    .space-between {
        justify-content: space-between;
    }

    .space-around {
        justify-content: space-around;
    }

    .stretch {
        align-items: stretch;
    }

    .self-center {
        align-self: center;
    }

    .margin20 {
        margin-right: 20px;
    }

    .margin30 {
        margin-right: 30px;
    }

    .border-top {
        border-top: 1px solid #ddd;
    }

    .border-left {
        border-left: 1px solid #ddd;
    }

    .border-right {
        border-right: 1px solid #ddd;
    }

    .border-bottom {
        border-bottom: 1px solid #ddd;
    }

    #global-toolbar {
        height:60px;
    }

    #workspace {
        height:calc(100% - 61px);
    }

</style>