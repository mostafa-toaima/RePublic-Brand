// country-map.component.ts
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { FeatureCollection } from 'geojson';
import { PerfumesService } from '../products/services/perfumes.service';

@Component({
  selector: 'app-country-map',
  templateUrl: './country-map.component.html',
  styleUrls: ['./country-map.component.scss']
})
export class CountryMapComponent implements OnInit, OnChanges {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Input() activeCountry: string | null = null;
  @Output() countrySelected = new EventEmitter<string>();

  private mapWidth = 800;
  private mapHeight = 500;
  private readonly MAP_PADDING = 20;

  private svg: any;
  private countries: any;
  private availableCountries: string[] = [];
  private tooltip: any;
  private zoom: any;
  private projection: any;
  private path: any;

  constructor(private perfumeService: PerfumesService) { }

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadCountries();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
    if (this.svg) {
      this.updateMapSize();
    }
  }

  private checkScreenSize(): void {
    if (window.innerWidth <= 768) { // $breakpoint-md
      this.mapWidth = 450;
      this.mapHeight = 500;
    } else {
      this.mapWidth = 800;
      this.mapHeight = 500;
    }
  }

  private loadCountries(): void {
    this.perfumeService.getCountries().subscribe({
      next: (countries) => {
        console.log('Available countries:', countries);

        this.availableCountries = countries;
        this.initializeMap();
      },
      error: (err) => console.error('Failed to load countries:', err)
    });
  }

  private initializeMap(): void {
    this.clearMapContainer();
    this.createSvgContainer();
    this.createTooltip();
    this.loadMapData();
  }

  private clearMapContainer(): void {
    this.mapContainer.nativeElement.innerHTML = '';
  }

  private createSvgContainer(): void {
    this.svg = d3.select(this.mapContainer.nativeElement)
      .append('svg')
      .attr('width', this.mapWidth)
      .attr('height', this.mapHeight)
      .style('background', '#f9f5f2') // $bg-color
      .style('border-radius', '12px')
      .style('box-shadow', '0 10px 30px rgba(0, 0, 0, 0.08)');
  }

  private createTooltip(): void {
    this.tooltip = d3.select(this.mapContainer.nativeElement)
      .append('div')
      .attr('class', 'map-tooltip')
      .style('opacity', 0)
      .style('background', '#5d4037') // $primary-color
      .style('color', '#f9f5f2') // $bg-color
      .style('border-left', '3px solid #d4af37'); // $gold-color
  }

  private loadMapData(): void {
    d3.json('assets/world-map/countries-50m.json').then((world: any) => {
      this.validateMapData(world);
      this.processMapData(world);
      this.renderMap();
      this.setupZoom();
    }).catch(this.handleMapError.bind(this));
  }

  private validateMapData(world: any): void {
    if (!world?.objects?.countries) {
      throw new Error('Invalid map data structure');
    }
  }

  private processMapData(world: any): void {
    const countriesFeatureCollection = topojson.feature(world, world.objects.countries) as unknown as FeatureCollection;
    this.countries = countriesFeatureCollection.features;
  }

  private renderMap(): void {
    this.projection = this.createProjection();
    this.path = d3.geoPath().projection(this.projection);

    // Add glow effect for available countries
    const defs = this.svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('width', '150%')
      .attr('height', '150%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3.5')
      .attr('result', 'blur');

    filter.append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blur')
      .attr('operator', 'over');

    // Draw countries
    this.svg.selectAll('.country')
      .data(this.countries)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('class', 'country')
      .attr('id', (d: any) => this.getCountryId(d.properties.name))
      .style('fill', (d: any) => this.getCountryColor(d.properties.name))
      .style('stroke', '#ffffff')
      .style('stroke-width', 0.8)
      .on('mouseover', (event: any, d: any) => this.onCountryHover(event, d))
      .on('mouseout', (event: any, d: any) => this.onCountryHoverEnd(event, d))
      .on('click', (event: any, d: any) => this.onCountryClick(event, d));

    // Add subtle gradient background
    this.svg.append('rect')
      .attr('width', this.mapWidth)
      .attr('height', this.mapHeight)
      .style('fill', 'url(#map-gradient)')
      .style('pointer-events', 'none')
      .lower();

    // Create gradient
    const gradient = this.svg.append('defs')
      .append('linearGradient')
      .attr('id', 'map-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .style('stop-color', '#f9f5f2') // $bg-color
      .style('stop-opacity', 0.8);

    gradient.append('stop')
      .attr('offset', '100%')
      .style('stop-color', '#d7ccc8') // $accent-color
      .style('stop-opacity', 0.3);
  }

  private createProjection() {
    return d3.geoMercator()
      .scale(this.getScale())
      .translate([this.mapWidth / 2, this.mapHeight / 1.5]);
  }

  private getScale(): number {
    return window.innerWidth <= 768 ? 100 : 130; // $breakpoint-md
  }

  private setupZoom(): void {
    this.zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event: any) => {
        this.svg.selectAll('.country')
          .attr('transform', event.transform)
          .attr('stroke-width', 0.8 / event.transform.k);
      });

    this.svg.call(this.zoom);
  }

  private updateMapSize(): void {
    this.svg
      .attr('width', this.mapWidth)
      .attr('height', this.mapHeight);

    this.projection = this.createProjection();
    this.path.projection(this.projection);

    this.svg.selectAll('.country')
      .attr('d', this.path);

    this.svg.select('rect')
      .attr('width', this.mapWidth)
      .attr('height', this.mapHeight);
  }

  private updateMapColors(): void {
    if (!this.countries || !this.svg) return;

    this.svg.selectAll('.country')
      .style('fill', (d: any) => this.getCountryColor(d.properties.name));
  }

  private getCountryId(countryName: string): string {
    return 'country-' + countryName.replace(/\s+/g, '-').toLowerCase();
  }

  private getCountryColor(countryName: string): string {
    if (this.isActiveCountry(countryName)) {
      return '#d4af37'; // $gold-color
    }
    return this.isAvailableCountry(countryName)
      ? '#8d6e63' // $secondary-color
      : '#d7ccc8'; // $accent-color (for unavailable countries)
  }

  private isActiveCountry(countryName: string): boolean {
    return !!this.activeCountry &&
      countryName.toLowerCase() === this.activeCountry.toLowerCase();
  }

  private isAvailableCountry(countryName: string): boolean {
    return this.availableCountries.includes(countryName);
  }

  private onCountryHover(event: any, countryData: any): void {
    const countryName = countryData.properties.name;
    const isAvailable = this.isAvailableCountry(countryName);

    d3.select(event.target)
      .style('stroke-width', 1.5)
      .style('filter', isAvailable ? 'url(#glow)' : '');

    if (isAvailable) {
      d3.select(event.target)
        .style('fill', '#5d4037') // $primary-color
        .style('cursor', 'pointer');

      this.showTooltip(event, countryName);
    }
  }

  private onCountryHoverEnd(event: any, countryData: any): void {
    d3.select(event.target)
      .style('fill', () => this.getCountryColor(countryData.properties.name))
      .style('stroke-width', 0.8)
      .style('filter', null)
      .style('cursor', 'default');

    this.hideTooltip();
  }

  private onCountryClick(event: any, countryData: any): void {
    if (this.isAvailableCountry(countryData.properties.name)) {
      d3.select(event.target)
        .style('transform', 'scale(0.95)')
        .transition()
        .duration(300)
        .style('transform', 'scale(1)');

      this.countrySelected.emit(countryData.properties.name);
    }
  }

  private showTooltip(event: any, countryName: string): void {
    this.tooltip.html(`<strong>${countryName}</strong><br>Click to explore fragrances`)
      .style('left', (event.pageX + 15) + 'px')
      .style('top', (event.pageY - 28) + 'px')
      .transition()
      .duration(200)
      .style('opacity', 1)
      .style('transform', 'translateY(0)');
  }

  private hideTooltip(): void {
    this.tooltip.transition()
      .duration(200)
      .style('opacity', 0)
      .style('transform', 'translateY(10px)');
  }

  private handleMapError(error: any): void {
    console.error('Error loading map data:', error);
    this.displayErrorMessage();
  }

  private displayErrorMessage(): void {
    this.svg.append('text')
      .attr('x', this.mapWidth / 2)
      .attr('y', this.mapHeight / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('fill', '#5d4037') // $primary-color
      .text('Could not load map data. Please try again later.');
  }

  ngOnChanges(): void {
    this.updateMapColors();
  }
}
