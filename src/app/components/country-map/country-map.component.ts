import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { PerfumeService } from '../../common/services/perfume.service';
import { FeatureCollection } from 'geojson';

@Component({
  selector: 'app-country-map',
  templateUrl: './country-map.component.html',
  styleUrls: ['./country-map.component.css']
})
export class CountryMapComponent implements OnInit, OnChanges {
  // View child reference to the map container
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  // Input for currently active country
  @Input() activeCountry: string | null = null;

  // Output event when a country is selected
  @Output() countrySelected = new EventEmitter<string>();

  // Map dimensions
  private readonly MAP_WIDTH = 900;
  private readonly MAP_HEIGHT = 500;

  // Color scheme
  private readonly COLOR_SCHEME = {
    activeCountry: '#B8860B',
    availableCountry: '#5F9EA0',
    defaultCountry: '#DDDDDD',
    hoverCountry: '#4682B4',
    stroke: '#FFFFFF'
  };

  private svg: any;
  private countries: any;
  private availableCountries: string[] = [];

  constructor(private perfumeService: PerfumeService) { }

  ngOnInit(): void {
    this.loadCountries();
  }

  ngOnChanges(): void {
    this.updateMapColors();
  }

  /**
   * Load available countries from service
   */
  private loadCountries(): void {
    this.perfumeService.getCountries().subscribe({
      next: (countries) => {
        this.availableCountries = countries;
        this.initializeMap();
      },
      error: (err) => console.error('Failed to load countries:', err)
    });
  }

  /**
   * Initialize the map visualization
   */
  private initializeMap(): void {
    this.clearMapContainer();
    this.createSvgContainer();
    this.loadMapData();
  }

  /**
   * Clear the map container
   */
  private clearMapContainer(): void {
    this.mapContainer.nativeElement.innerHTML = '';
  }

  /**
   * Create the SVG container for the map
   */
  private createSvgContainer(): void {
    this.svg = d3.select(this.mapContainer.nativeElement)
      .append('svg')
      .attr('width', this.MAP_WIDTH)
      .attr('height', this.MAP_HEIGHT)
      .style('background-color', '#f5f5f5');
  }

  /**
   * Load and render the map data
   */
  private loadMapData(): void {
    d3.json('assets/world-map/countries-50m.json').then((world: any) => {
      this.validateMapData(world);
      this.processMapData(world);
      this.renderMap();
    }).catch(error => {
      this.handleMapError(error);
    });
  }

  /**
   * Validate the map data structure
   */
  private validateMapData(world: any): void {
    if (!world?.objects?.countries) {
      throw new Error('Invalid map data structure');
    }
  }

  /**
   * Process the map data
   */
  private processMapData(world: any): void {
    const countriesFeatureCollection = topojson.feature(world, world.objects.countries) as unknown as FeatureCollection;
    this.countries = countriesFeatureCollection.features;
  }

  /**
   * Render the map with countries
   */
  private renderMap(): void {
    const projection = this.createProjection();
    const path = d3.geoPath().projection(projection);

    this.svg.selectAll('path')
      .data(this.countries)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'country')
      .attr('id', (d: any) => this.getCountryId(d.properties.name))
      .style('fill', (d: any) => this.getCountryColor(d.properties.name))
      .style('stroke', this.COLOR_SCHEME.stroke)
      .style('stroke-width', 0.5)
      .on('mouseover', (event: any, d: any) => this.onCountryHover(event, d))
      .on('mouseout', (event: any, d: any) => this.onCountryHoverEnd(event, d))
      .on('click', (event: any, d: any) => this.onCountryClick(event, d));
  }

  /**
   * Create map projection
   */
  private createProjection() {
    return d3.geoMercator()
      .scale(130)
      .translate([this.MAP_WIDTH / 2, this.MAP_HEIGHT / 1.5]);
  }

  /**
   * Handle map loading errors
   */
  private handleMapError(error: any): void {
    console.error('Error loading map data:', error);
    this.displayErrorMessage();
  }

  /**
   * Display error message when map fails to load
   */
  private displayErrorMessage(): void {
    this.svg.append('text')
      .attr('x', this.MAP_WIDTH / 2)
      .attr('y', this.MAP_HEIGHT / 2)
      .attr('text-anchor', 'middle')
      .text('Could not load map data');
  }

  /**
   * Update country colors when input changes
   */
  private updateMapColors(): void {
    if (!this.countries || !this.svg) return;

    this.svg.selectAll('.country')
      .style('fill', (d: any) => this.getCountryColor(d.properties.name));
  }

  /**
   * Get CSS id for a country
   */
  private getCountryId(countryName: string): string {
    return 'country-' + countryName.replace(/\s+/g, '-');
  }

  /**
   * Get color for a country based on its status
   */
  private getCountryColor(countryName: string): string {
    if (this.isActiveCountry(countryName)) {
      return this.COLOR_SCHEME.activeCountry;
    }
    return this.isAvailableCountry(countryName)
      ? this.COLOR_SCHEME.availableCountry
      : this.COLOR_SCHEME.defaultCountry;
  }

  /**
   * Check if country is currently active
   */
  private isActiveCountry(countryName: string): boolean {
    return !!this.activeCountry &&
      countryName.toLowerCase() === this.activeCountry.toLowerCase();
  }

  /**
   * Check if country has perfumes available
   */
  private isAvailableCountry(countryName: string): boolean {
    return this.availableCountries.includes(countryName);
  }

  /**
   * Handle country hover event
   */
  private onCountryHover(event: any, countryData: any): void {
    if (this.isAvailableCountry(countryData.properties.name)) {
      d3.select(event.target)
        .style('fill', this.COLOR_SCHEME.hoverCountry)
        .style('cursor', 'pointer');
    }
  }

  /**
   * Handle country hover end event
   */
  private onCountryHoverEnd(event: any, countryData: any): void {
    d3.select(event.target)
      .style('fill', () => this.getCountryColor(countryData.properties.name));
  }

  /**
   * Handle country click event
   */
  private onCountryClick(event: any, countryData: any): void {
    if (this.isAvailableCountry(countryData.properties.name)) {
      this.countrySelected.emit(countryData.properties.name);
    }
  }
}
