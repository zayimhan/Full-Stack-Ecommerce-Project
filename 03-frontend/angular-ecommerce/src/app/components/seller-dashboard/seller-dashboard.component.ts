import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: false,
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {

  products: Product[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  totalPages: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getSellerProductsPaginated(this.currentPage - 1, this.pageSize);
  }

  getSellerProductsPaginated(page: number, size: number): void {
    this.productService.getProductsBySellerPaginated(page, size).subscribe(data => {
      this.products = data.products;
      this.totalElements = data.page.totalElements;
      this.totalPages = data.page.totalPages;
      this.currentPage = data.page.number + 1; // backend starts at 0
      console.log("Sayfa değiştiriliyor:", this.currentPage);
    });
  }

  updatePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.getSellerProductsPaginated(0, this.pageSize);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getSellerProductsPaginated(page - 1, this.pageSize);
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  deleteProduct(productId: number): void {
  if (confirm('Bu ürünü devre dışı bırakmak istediğinize emin misiniz?')) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        alert('Ürün devre dışı bırakıldı.');
        this.getSellerProductsPaginated(this.currentPage - 1, this.pageSize);
      },
      error: err => {
        alert('İşlem başarısız.');
        console.error('Silme hatası:', err);
      }
    });
  }
}

activateProduct(productId: number): void {
  this.productService.activateProduct(productId).subscribe({
    next: () => {
      this.getSellerProductsPaginated(this.currentPage - 1, this.pageSize);
    },
    error: err => {
      console.error('Aktif etme hatası:', err);

      if (err.status === 403) {
        alert(err.error?.message || 'Bu ürünü aktif etme yetkiniz yok.Admin ile iletişime geçin.');
      } else {
        alert('Ürün aktif edilirken bir hata oluştu.');
      }
    }
  });
}



  
  
}
