import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(private http: HttpClient,private productService:ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
  const token = localStorage.getItem('admin_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.get<any[]>('http://localhost:8080/api/admin/products', { headers })
    .subscribe({
      next: (data) => {
        // Hem aktif hem pasif ürünler gelir, ayırt etmek istersen:
        this.products = data;
      },
      error: (err) => {
        console.error('Ürünler alınamadı', err);
        alert('Ürünler getirilemedi.');
      }
    });
}


  deactivateProduct(productId: number): void {
  this.productService.deactivateProductAsAdmin(productId).subscribe({
    next: () => {
      // Ürün listeden kaldırılabilir ya da aktiflik durumu güncellenebilir
      this.products = this.products.filter(p => p.id !== productId);
    },
    error: (err) => {
      console.error('Ürün devre dışı bırakılamadı', err);
      alert('Devre dışı bırakma işlemi başarısız.');
    }
  });
}

activateProduct(productId: number): void {
  const token = localStorage.getItem('admin_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.put(`http://localhost:8080/api/admin/products/${productId}/activate`, {}, { headers })
    .subscribe({
      next: () => this.getProducts(),  // Listeyi güncelle
      error: err => console.error('Ürün aktif edilemedi', err)
    });
}



}
