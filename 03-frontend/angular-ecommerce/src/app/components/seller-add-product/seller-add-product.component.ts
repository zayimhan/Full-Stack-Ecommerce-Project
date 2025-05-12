import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { ProductCategory } from '../../common/product-category';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seller-add-product',
  standalone: false,
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent implements OnInit {

  productForm!: FormGroup;
  errorMessage = '';
  successMessage = '';
  categories: ProductCategory[] = [];
  selectedFile!: File;
  previewUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      unitsInStock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      categoryId: [null, Validators.required]
    });

    this.productService.getProductCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => this.errorMessage = 'Kategoriler yüklenemedi.'
    });
  }

  // ✅ Görsel seçildiğinde çalışır
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Önizleme için
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  // ✅ Görseli yükle ve ardından formu submit et
  uploadImageAndSubmit(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Lütfen bir görsel seçin.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<{ imageUrl: string }>('http://localhost:8080/api/upload', formData)
      .subscribe({
        next: response => {
          this.productForm.patchValue({ imageUrl: response.imageUrl });
          this.onSubmit();  // Görsel URL'si geldiğinde ürünü kaydet
        },
        error: () => {
          this.errorMessage = 'Görsel yüklenemedi.';
        }
      });
  }

  // ✅ Ürün ekle
  onSubmit(): void {
    if (this.productForm.invalid) return;

    const formValues = this.productForm.value;

    const newProduct: any = {
      name: formValues.name,
      description: formValues.description,
      unitPrice: formValues.unitPrice,
      unitsInStock: formValues.unitsInStock,
      imageUrl: formValues.imageUrl,
      category: { id: formValues.categoryId }
    };

    this.productService.addProduct(newProduct).subscribe({
      next: () => {
        this.successMessage = 'Ürün başarıyla eklendi!';
        this.router.navigate(['/seller-dashboard']);
      },
      error: () => {
        this.errorMessage = 'Ürün eklenemedi.';
      }
    });
  }
}
