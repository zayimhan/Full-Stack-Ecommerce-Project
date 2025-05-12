import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.shopAppUrl + '/products';
  private categoryUrl = environment.shopAppUrl + '/product-category';

  constructor(private httpClient: HttpClient) {}

  getProduct(productId: number): Observable<Product> {
    const url = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(url);
  }

  addProduct(product: Product): Observable<Product> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post<Product>(this.baseUrl, product, { headers });
  }

getProductListPaginate(page: number, size: number, categoryId: number): Observable<any> {
  const url = `${this.baseUrl}/category/${categoryId}/paginate?page=${page}&size=${size}`;
  return this.httpClient.get<any>(url);
}


  /** ✅ Pagination destekli arama */
  searchProductListPaginate(page: number, size: number, keyword: string): Observable<any> {
  const url = `${this.baseUrl}/search/${keyword}/paginate?page=${page}&size=${size}`;
  return this.httpClient.get<any>(url);
}

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  deleteProduct(productId: number): Observable<any> {
    const token = localStorage.getItem('seller_token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.delete(`${this.baseUrl}/${productId}`, { headers });
  }

  activateProduct(productId: number): Observable<any> {
  const token = localStorage.getItem('seller_token') || '';
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.httpClient.put(`${this.baseUrl}/${productId}/activate`, {}, { headers });
}


  updateProduct(productId: number, updatedProduct: Product): Observable<Product> {
    const token = localStorage.getItem('jwtToken');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const url = `${this.baseUrl}/${productId}`;
    return this.httpClient.put<Product>(url, updatedProduct, { headers });
  }

  getProductsBySellerPaginated(page: number, size: number): Observable<{ products: Product[], page: any }> {
    const url = `${this.baseUrl}/seller?page=${page}&size=${size}`;
    return this.httpClient.get<any>(url).pipe(
      map(response => ({
        products: response.content,
        page: {
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          number: response.number
        }
      }))
    );
  }

  deactivateProductAsAdmin(productId: number): Observable<any> {
  const token = localStorage.getItem('admin_token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.httpClient.put(`http://localhost:8080/api/admin/products/${productId}/deactivate`, {}, { headers });
}


}



interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
