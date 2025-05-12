import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  productForm!: FormGroup;
  productId!: number;
  isLoading = true;
  errorMessage = '';
  imagePreviewUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      unitPrice: [0, Validators.required],
      unitsInStock: [0, Validators.required],
      imageUrl: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = +idParam;

      this.productService.getProduct(this.productId).subscribe({
        next: (product: Product) => {
          this.productForm.patchValue(product); // Formu doldur
          this.imagePreviewUrl = product.imageUrl; // Resmi göster
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Ürün alınamadı.';
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const updatedProduct: Product = this.productForm.value;
    this.productService.updateProduct(this.productId, updatedProduct).subscribe({
      next: () => this.router.navigate(['/seller-dashboard']),
      error: () => this.errorMessage = 'Ürün güncellenemedi.'
    });
  }

  cancel(): void {
    this.router.navigate(['/seller-dashboard']);
  }
}
